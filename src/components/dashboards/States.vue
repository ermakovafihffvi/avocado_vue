<template>
    <div v-if="fixingPeriod && lastSum">
        <h6> 
            {{ $t('common.last_period') }}: <span class="text-primary">{{ fixingPeriod.prevStr + ' - ' + fixingPeriod.nextStr }}</span>
        </h6> 
        <h6>
            {{ $t('common.last_state') }}: <span class="text-primary">{{ lastSum }}</span>
        </h6>
    </div>
    <q-carousel
        v-model="slide"
        transition-prev="jump-right"
        transition-next="jump-left"
        swipeable
        animated
        control-color="primary"
        navigation
        arrows
        style="max-height: 100vh; min-height: 460px;"
        class="rounded-borders q-pb-xl"
    >
        <q-carousel-slide 
            :name="userData.user.name" 
            class="column no-wrap flex-center" 
            v-for="(userData) in states" 
            :key="userData.user.id"
        >
            <q-scroll-area class="fit">
                <div class="item-date">
                    <p class="text-center text-primary">{{ userData.user.name }}</p>
                </div>
                <q-table
                    color="dark"
                    bordered
                    :rows="userData.rows"
                    :columns="columns"
                    row-key="date"
                    :separator="'cell'"
                    hide-pagination
                    :pagination="{
                        rowsPerPage: 0
                    }"
                >
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td key="date" :props="props">
                                {{ props.row.date_str }}
                            </q-td>
                            <q-td v-for="stateCat in mainStore.state.stateCategories" :key="stateCat.str_id" :props="props">
                                {{ props.row[stateCat.str_id] }}
                                <q-popup-edit v-model="props.row[stateCat.str_id]" v-slot="scope" v-if="userData.user.id">
                                    <q-input
                                        v-model="scope.value"
                                        autofocus
                                        dense
                                        :rules="[val => numberTest(val) || $t('validation.number', {field: $t('common.state')})]"
                                        @update:model-value="onUpdateStateCell(userData.user.id, stateCat, props.row.date, scope.value)"
                                    />
                                </q-popup-edit>
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-scroll-area>
        </q-carousel-slide>
    </q-carousel>

    <div class="q-mt-lg" v-if="!loading">
        <state-chart :dateRange="props.dateRange" :selectedCurrency="props.selectedCurrency"/>
    </div>
</template>

<script setup>
import { getAvailableDates, getPeriodsList } from '@/composables/getAvailableDates';
import { useI18n } from 'vue-i18n';
import { useMainStore } from '@/store/main';
import { computed, onMounted, ref, watch } from 'vue';
import validationRules from '#shared/validation/rules.js';
import { useDebounceFn } from '@vueuse/core';
import useClient from '@/api/useClient';
import StateChart from '@/components/dashboards/StateChart.vue';

const { numberTest } = validationRules();
const mainStore = useMainStore();
const props = defineProps(['dateRange', 'selectedCurrency']);
const { t } = useI18n();
const api = useClient();

const loading = ref(true);
const slide = ref();
const users = computed(() => mainStore.state.users);
const periodsList = computed(() => {
    return getPeriodsList(props.dateRange);
});

const eachUserData = computed(() => {
    return users.value?.map((user) => {

        const usersStates = mainStore.state.states?.filter(state => state.user_id == user.id) ?? [];
        const rows = [];
        
        periodsList.value?.forEach(dateObj => {
            const elem = {
                date: Object.keys(dateObj)[0],
                date_str: Object.values(dateObj)[0]
            };
            mainStore.state.stateCategories?.forEach(cat => {
                const userStat = usersStates?.find(i => i.category_id == cat.id && i.pseudo_month == Object.keys(dateObj)[0]);
                elem[cat.str_id] = userStat ? Number(userStat?.sum) ?? 0 : 0;
            });
            rows.push(elem);            
        });

        return {
            user: user,
            rows: rows
        };
    });
});

const states = computed(() => {
    return eachUserData.value?.concat({
        user: { name: t('common.total'), id: 0 },
        rows: periodsList.value?.map(dateObj => {
            const elem = {
                date: Object.keys(dateObj)[0],
                date_str: Object.values(dateObj)[0]
            };
            mainStore.state.stateCategories?.forEach(cat => {
                const statesData = mainStore.state.states?.filter(i => i.category_id == cat.id && i.pseudo_month == Object.keys(dateObj)[0]) ?? [];
                elem[cat.str_id] = statesData?.reduce((prev, i) => prev + (Number(i.sum) ?? 0), 0) ?? 0;
            });
            return elem;          
        })
    });
});
const columns = computed(() => {
    return [{
        name: 'date',
        required: true,
        label: t('common.month'),
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true,
        sort: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
    }].concat(mainStore.state.stateCategories?.map(cat => {
        return {
            name: cat.str_id,
            required: true,
            label: cat.title  + ', ' + mainStore.state.currencies?.find(i => i.id == cat.currency_id).str_id,
            align: 'left',
            field: row => row.name,
            format: val => `${val}`,
            sortable: true,
            sort: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
        };
    }));
});

const fixingPeriod = ref();

const lastSum = computed(() => {
    return Number(mainStore.state.lastState) ? (Number(mainStore.state.lastState) * Number(props.selectedCurrency.rate)).toFixed(2) + ' ' + props.selectedCurrency.str_id : null;
});

const onUpdateStateCell = async (userId, cat, date, value) => {
    useDebounceFn(async () => {
        if (!numberTest(value)) return; 
        const dataRes = {
            'category_id': cat.id,
            'user_id': userId,
            'sum': value,
            'pseudo_month': date
        };
        const { data, error } = await api(`api/state/update`).post(dataRes).json();
        if (error.value) {
            $q.notify({
                type: 'error',
                message: error.value,
                color: 'negative'
            });
        } else {
            const existingItem = mainStore.state.states.find(item => (item.user_id == userId && item.category_id == cat.id && item.pseudo_month == date));
            if (existingItem) {
                existingItem.sum = value;
            } else {
                mainStore.state.states.push(data.value);
            }
        }
    }, 600)();
};

const prepareData = async () => {
    loading.value = true;
    await mainStore.loadStateCategories();
    await mainStore.loadCurrentStates(props.dateRange);
    loading.value = false;
    
    fixingPeriod.value = getAvailableDates();
    slide.value = t('common.total');
    //slide.value = useDateFormat(new Date(props.dateRange[1].year + '/' + (props.dateRange[1].month + 1) + '/22'), 'YYYY-MM', { locale: 'en-US' }).value;
};

onMounted(() => {
    prepareData();
});

watch(
    () => props.dateRange, 
    () => {
        prepareData();
    },
    { deep: true }
);

watch(
    () => props.selectedCurrency, 
    () => {
        prepareData();
    },
    { deep: true }
);
</script>

<style lang="scss" scoped>
.item-date {
    position: sticky;
    top: 0
}
.sum-item-space {
    min-width: 15px;
}
.sum-item-btn {
    &:active::before, &::before {
        box-shadow: none !important;
    }
}
.add-state-btn {
    background-color: $secondary-light;
}
</style>
