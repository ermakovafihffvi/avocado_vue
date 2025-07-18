<template>
    <h4 class="text-center q-mb-md text-primary">Total Expenses</h4>
    <LoadingSpinner v-if="loading || !mainStore.state.users || !mainStore.state.currencies" :size="'lg'"/>
    <div class="q-pa-md" v-else>
        <div class="row q-col-gutter-xs q-mb-xs">
            <div class="col total-card" v-for="(total, currency) in totalExpenses">
                <q-card dark bordered>
                    <q-card-section>
                        <div class="text-h5 text-primary text-center">{{ currency }}</div>   
                    </q-card-section>
                    <q-separator dark inset />
                    <q-card-section>
                        <div class="text-subtitle1 text-center">{{ total }}</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div class="row q-col-gutter-xs q-mb-xss">
            <div class="col total-card" v-for="(total, currency) in totalExpensesWOHouse">
                <q-card dark bordered>
                    <q-card-section>
                        <div class="text-h5 text-primary text-center">{{ currency }}, wo house</div>   
                    </q-card-section>
                    <q-separator dark inset />
                    <q-card-section>
                        <div class="text-subtitle1 text-center">{{ total }}</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <q-table
            color="dark"
            :grid="$q.screen.xs"
            bordered
            :rows="rows"
            :columns="columns"
            row-key="id"
            hide-pagination
            :pagination="{
                rowsPerPage: 0
            }"
        >
            <template v-slot:item="props">
                <div
                    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                >
                <q-card bordered flat>
                    <q-card-section>
                        <a class="text-body1 link bold">
                            {{ props.cols.find(col => col.name == 'category').value }}
                            <q-icon name="double_arrow" class="q-mb-xs" />
                        </a>
                        <div class="text-body1 text-bold text-center q-mt-sm">{{ props.cols.find(col => col.name == 'expenses').value }}</div>
                        <q-list dense>
                            <q-item v-for="col in props.cols.filter(col => col.name !== 'category' && col.name !== 'expenses')" :key="col.name">
                                <q-item-section>
                                    <q-item-label>{{ col.label }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-item-label caption>{{ col.value }}</q-item-label>
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
import useClient from '@/api/useClient';
import { computed, onMounted, ref } from 'vue';
import LoadingSpinner from '../base/LoadingSpinner.vue';
import { useMainStore } from '@/store/main';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const api = useClient();
const mainStore = useMainStore();
const loading = ref(true);
const expenses = ref(null);
const columns = ref([
    {
        name: 'category',
        label: 'Category',
        field: 'category',
        align: 'left'
    },
    {
        name: 'expenses',
        label: 'Expenses',
        field: 'expenses',
        align: 'right'
    },
    {
        name: 'limit',
        label: 'Limit',
        field: 'limit',
        align: 'right'
    },
    {
        name: 'remain',
        label: 'Remain',
        field: 'remain',
        align: 'right'
    }
]);
const rows = computed(() => {
    if (!mainStore.state.expensesCategories) {
        return [];
    }
    return mainStore.state.expensesCategories.reduce((result, category) => {
        if (category.special) {
            return result;
        }
        const expense = expenses.value.find(item => item.category_id == category.id)?.total ?? 0;
        const currency = mainStore.state.currencies.find(item => item.id == category.currency_id).str_id;
        result.push({
            category_str: category.str_id,
            category: category.title + ', ' + currency,
            currency: currency,
            expenses: expense,
            limit: category.limit,
            remain: !isNaN(category.limit) ? category.limit - expense : '' 
        });
        return result;
    }, []);
});
const totalExpenses = computed(() => {
    return rows.value.reduce((result, item) => {
        if(!result[item.currency]) result[item.currency] = 0;
        result[item.currency] += Number(item.expenses);
        return result;
    }, {});
});
const totalExpensesWOHouse = computed(() => {
    return rows.value.reduce((result, item) => {
        if(!result[item.currency]) result[item.currency] = 0;
        result[item.currency] += item.category_str == 'house' ? 0 :  Number(item.expenses);
        return result;
    }, {});
});
const loadTotalExpenses = async () => {
    loading.value = true;
    const { data, error } = await api('api/expense/total').get().json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
        return;
    }
    expenses.value = data.value;
    loading.value = false;
};

onMounted(() => {
    loadTotalExpenses();
});
</script>

<style lang="scss" scoped>
.total-card {
    min-width: 150px;
}
</style>