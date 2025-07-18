<template>
        <div class="card-title-wrapper q-pa-md">
        <div class="text-title-wrapper">
            <h6 class="text-h6 text-primary">{{ userNameTitle ? userNameTitle + ' Income' : '' }}</h6>
            <div class="column">
                <span class="text-primary" :class="{ 'text-h5': !userSumsWOMax.length }">
                    {{ userSum[maxUserSumKey] }}&nbsp;{{ mainStore.state.currencies?.find(el => el.id == maxUserSumKey)?.str_id }}
                </span>
                <span class="text-primary" v-for="value in userSumsWOMax">
                    {{ value.value }}&nbsp;{{ mainStore.state.currencies?.find(el => el.id == value.key)?.str_id }}
                </span>
            </div>
        </div>
        <q-btn push color="primary" label="Add income" @click="handleAddIncome" />
    </div>
    <LoadingSpinner v-if="loading" :size="'lg'"/>
    <div class="q-pa-md expenses-table-wrapper" v-else>
        <q-table
            color="dark"
            :grid="$q.screen.xs"
            bordered
            :rows="incomes"
            :columns="columns"
            row-key="id"
            :separator="'cell'"
            hide-pagination
            :pagination="{
                rowsPerPage: 0
            }"
            @row-click="handleRowClick"
        >
            <template v-slot:body-cell-sum="props">
                <q-td :props="props" @click.stop>
                    {{ props.row.sum + ' ' + props.row.currency }}
                </q-td>
            </template>
            <template v-slot:body-cell-delete="props">
                <q-td :props="props" @click.stop>
                    <DeleteButton @handle-delete="handleDelete(props.row.id)"/>
                </q-td>
            </template>
            <template v-slot:item="props">
                <div
                    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                >
                    <q-card bordered flat>
                        <q-card-section>
                            <q-list dense>
                                <q-item v-for="col in props.cols" :key="col.name">
                                    <q-item-section>
                                        <div v-if="col.name == 'delete'" @click.stop class="card-delete-wrapper">
                                            <DeleteButton
                                                @handle-delete="handleDelete(props.row.id)" 
                                            />
                                        </div>
                                        <q-item-label v-else>{{ col.label }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label caption v-if="col.name == 'sum'">
                                            {{ props.row[col.name] + ' ' + props.row.currency }}
                                        </q-item-label>
                                        <q-item-label caption v-else>{{ props.row[col.name] }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </div>
            </template>
        </q-table>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import useClient from '@/api/useClient';
import { useDateFormat } from '@vueuse/core';
import { useMainStore } from '@/store/main';
import { useQuasar } from 'quasar';
import useOpenAddIncomes from '@/composables/openAddIncome';
import DeleteButton from '@/components/buttons/DeleteButton.vue';

const api = useClient();
const mainStore = useMainStore();

const props = defineProps({
    userId: {
        type: [String, Number],
        required: true
    },
    userNameTitle: String
});
const loading = ref(true);
const userSum = ref({});
const incomes = ref(null);
const initLoading = ref(true);

const maxUserSumKey = computed(() => {
    return Object.entries(userSum.value).reduce((max, [key, value]) => {
        return value > userSum.value[max] ? key : max;
    }, Object.keys(userSum.value)[0]);
});
const userSumsWOMax = computed(() => {
    return Object.entries(userSum.value).reduce((acc, [key, value]) => {
        if (key != maxUserSumKey.value) {
            acc.push({
                'key': key,
                'value': value
            });
        }
        return acc;
    }, []);
});

const columns = [
    {
        name: 'desc',
        required: true,
        label: 'Description',
        align: 'left',
        field: row => row.desc,
        format: val => `${val}`,
        sortable: true,
        sort: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
    },
    {
        name: 'sum',
        required: true,
        label: 'Sum',
        align: 'left',
        field: row => row.sum,
        format: val => `${val}`,
        sortable: true,
        sort: (a, b) => a - b
    },
    /*{
        name: 'currency',
        required: true,
        label: 'Currency',
        align: 'left',
        field: row => row.currency,
        format: val => `${val}`,
        sortable: false,
    },*/
    {
        name: 'date',
        required: true,
        label: 'Date',
        align: 'left',
        field: row => row.date,
        format: val => `${val}`,
        sortable: true,
        sort: (a, b) => a - b
    },
    {
        name: 'delete',
        required: true,
        label: 'Delete',
        align: 'left'
    }
];

//handle add expenses btn
const $q = useQuasar();
const openAddIncomes = useOpenAddIncomes($q);
const handleAddIncome = () => {
    openAddIncomes.openModal({
        userId: props.userId
    });
};
const handleRowClick = (e, row) => {
    openAddIncomes.openModal({
        userId: props.userId,
        date: row.date,
        id: row.id,
        sum: row.sum,
        description: row.desc,
        currency: row.currency_id
    });
};
// end handle add expenses btn

const handleDelete = async (id) => {
    const { error } = await api(`/api/income/${id}/delete`).delete().json();
    if (error.value) {

    } else {
        mainStore.state.usersIncomes[props.userId] = mainStore.state.usersIncomes[props.userId].reduce(function (acc, item) {
            if (item.id !== id) {
                acc.push(item);
            }
            return acc;
        }, []);
    }
};

const prepareData = async () => {
    loading.value = true;
    await mainStore.loadCurrencies();
    await loadIncomes();
    initLoading.value = false;
    loading.value = false;
};

const loadIncomes = async () => {
    incomes.value = [];
    userSum.value = {};
    if (typeof mainStore.state.usersIncomes[props.userId] === 'undefined') {
        const { data, error } = await api('api/income/user/' + props.userId).get().json();
        if (error.value) {
            return;
        } else {
            mainStore.state.usersIncomes[props.userId] = data.value;
        }
    }
    mainStore.state.usersIncomes[props.userId].forEach((item) => {
        if (!userSum.value[item.currency_id]) {
            userSum.value[item.currency_id] = 0;
        }
        userSum.value[item.currency_id] += Number(item.sum);
        incomes.value.push({
            id: item.id,
            desc: item.desc,
            sum: item.sum,
            currency_id: item.currency_id,
            currency: mainStore.state.currencies.find(el => item.currency_id == el.id).str_id,
            date: useDateFormat(item.created_at, 'YYYY-MM-DD'),
        });
    });
};

onMounted(() => {
    prepareData();
});

watch(
    () => mainStore.state.usersIncomes[props.userId], 
    () => {
        if (!initLoading.value) {
            nextTick(() => {
                if (!initLoading.value) {
                    prepareData();
                }
            });
        }
    },
    { deep: true }
);

watch(
    () => props.userId,
    () => {
        initLoading.value = true;
        prepareData();
    }
);

</script>