<template>
        <div class="card-title-wrapper q-pa-md">
        <div class="text-title-wrapper">
            <h6 class="text-h6 text-primary">{{ userNameTitle ? userNameTitle + ' Income' : '' }}</h6>
            <span class="text-h5 text-primary">{{ userSum }}</span>
        </div>
        <q-btn push color="primary" label="Add expense" @click="handleAddIncome" />
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
            <template v-slot:item="props">
                <div
                    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                >
                    <q-card bordered flat>
                        <q-card-section>
                            <q-list dense>
                                <q-item v-for="col in props.cols" :key="col.name">
                                    <q-item-section>
                                        <q-item-label>{{ col.label }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label caption>{{ props.row[col.name] }}</q-item-label>
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
import { nextTick, onMounted, ref, watch } from 'vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import useClient from '@/api/useClient';
import { useDateFormat } from '@vueuse/core';
import { useMainStore } from '@/store/main';
import { useQuasar } from 'quasar';
import useOpenAddIncomes from '@/composables/openAddIncome';

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
const userSum = ref(0);
const incomes = ref(null);
const initLoading = ref(true);

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
    {
        name: 'currency',
        required: true,
        label: 'Currency',
        align: 'left',
        field: row => row.currency,
        format: val => `${val}`,
        sortable: false,
    },
    {
        name: 'date',
        required: true,
        label: 'Date',
        align: 'left',
        field: row => row.date,
        format: val => `${val}`,
        sortable: true,
        sort: (a, b) => a - b
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

const loadCurrencies = async () => {
    if (mainStore.state.currencies) return;
    const { data, error } = await api('api/currencies').get().json();
    if (error.value) {

    } else {
        mainStore.state.currencies = data.value;
    }
};

const prepareData = async () => {
    loading.value = true;
    await loadCurrencies();
    await loadIncomes();
    initLoading.value = false;
    loading.value = false;
};

const loadIncomes = async () => {
    incomes.value = [];
    userSum.value = 0;
    if (typeof mainStore.state.usersIncomes[props.userId] === 'undefined') {
        const { data, error } = await api('api/' + props.userId + '/incomes').get().json();
        if (error.value) {
            return;
        } else {
            mainStore.state.usersIncomes[props.userId] = data.value;
        }
    }
    mainStore.state.usersIncomes[props.userId].forEach((item) => {
        userSum.value += Number(item.sum);
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