<template>
    <div class="card-title-wrapper q-pa-md">
        <div class="text-title-wrapper">
            <h6 class="text-h6 text-primary">{{ userNameTitle ? userNameTitle + ' Expenses' : '' }}</h6>
            <span class="text-h5 text-primary">{{ userSum }}</span>
        </div>
        <q-btn push color="primary" label="Add expense" @click="handleAddExpense" />
    </div>
    <LoadingSpinner v-if="loading" :size="'lg'" />
    <div class="q-pa-md expenses-table-wrapper" v-else>
        <q-table flat bordered
            :rows="categories" 
            :columns="columns" 
            row-key="name" 
            hide-pagination
            :pagination="{
                rowsPerPage: 0
            }"
        >

            <template v-slot:header="props">
                <q-tr :props="props">
                    <q-th auto-width />
                    <q-th v-for="col in props.cols" :key="col.name" :props="props">
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>

            <template v-slot:body="props">
                
                <q-tr :props="props">
                    <q-td auto-width>
                        <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand"
                            :icon="props.expand ? 'remove' : 'add'" />
                    </q-td>
                    <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        {{ col.value }}
                    </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                        <div class="sub-table-wrapper">
                            <q-table
                                color="dark"
                                :grid="$q.screen.xs"
                                bordered
                                :rows="expenses[props.row.id]"
                                :columns="subColumns"
                                row-key="id"
                                :separator="'cell'"
                                hide-pagination
                                :pagination="{
                                    rowsPerPage: 0
                                }"
                                @row-click="handleRowClick"
                            >
                            
                                <template v-slot:item="subProps">
                                    <div
                                        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                                    >
                                        <q-card bordered flat>
                                            <q-card-section>
                                                <q-list dense>
                                                    <q-item v-for="col in subProps.cols" :key="col.name">
                                                        <q-item-section>
                                                            <q-item-label>{{ col.label }}</q-item-label>
                                                        </q-item-section>
                                                        <q-item-section side>
                                                            <q-item-label caption>{{ subProps.row[col.name] }}</q-item-label>
                                                        </q-item-section>
                                                    </q-item>
                                                </q-list>
                                            </q-card-section>
                                        </q-card>
                                    </div>
                                </template>
                            </q-table>
                        </div>

                    </q-td>
                </q-tr>
            </template>

        </q-table>
    </div>
</template>

<script setup>
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import useClient from '@/api/useClient';
import { useQuasar } from 'quasar';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useMainStore } from '@/store/main';
import useOpenAddExpenses from '@/composables/openAddExpense';
import { useDateFormat } from '@vueuse/core';

const api = useClient();
const mainStore = useMainStore();
const props = defineProps({
    userId: [String, Number],
    userNameTitle: String
});

const loadingExpenses = ref(true);
const loadingCategories = ref(true);
const loading = ref(true);
const initLoading = ref(true);
const expenses = ref({});
const categories = ref([]);
const userSum = ref(0);
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Category title',
    align: 'left',
    field: row => row.name,
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
    name: 'limit',
    required: true,
    label: 'Limit',
    align: 'left',
    field: row => row.limit,
    format: val => `${val}`,
    sortable: false
  }
];

const subColumns = [
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
        name: 'description',
        required: true,
        label: 'Desc',
        align: 'left',
        field: row => row.description,
        format: val => `${val}`,
        sortable: false
    },
    {
        name: 'date',
        required: true,
        label: 'Date',
        align: 'left',
        field: row => row.date,
        format: val => `${val}`,
        sortable: false
    }
];

const resetData = () => {
    expenses.value = {};
    userSum.value = 0;
    categories.value.forEach(item => item.sum = 0);
};

const defineExpenses = () => {
    resetData();
    mainStore.state.usersExpenses[props.userId]?.forEach((item) => {
        const category = categories.value.find(el => el.id == item.category_id);
        if (typeof category !== 'undefined') {
            category.sum += Number(item.sum);
            userSum.value += Number(item.sum);
            if (!(item.category_id in expenses.value)) {
                expenses.value[item.category_id] = [];
            }
            expenses.value[item.category_id].push({
                sum: item.sum,
                id: item.id,
                description: item.desc,
                date: useDateFormat(item.created_at, 'YYYY-MM-DD'),
                categoryStr: category.str_id
            });
        }
    });
};

const loadExpenses = async () => {
    loadingExpenses.value = true;
    expenses.value = {};
    if (typeof mainStore.state.usersExpenses[props.userId] === 'undefined' || mainStore.state.usersExpenses[props.userId] == 'null') {
        const { data, error } = await api('api/' + props.userId + '/expenses?special=0').get().json();
        if (error.value) {
            //error
            //console.log(error.value);
        } else {
            mainStore.state.usersExpenses[props.userId] = data.value;
        }
    }
 
    loadingExpenses.value = false;
};
const loadExpCategories = async () => {
    loadingCategories.value = true;
    categories.value = [];
    if (!mainStore.state.expensesCategories) {
        const { data, error } = await api('api/expenses-categories?special=0').get().json();
        if (error.value) {
            //error
            //console.log(error.value);
        }
        mainStore.state.expensesCategories = data.value;
    }
    mainStore.state.expensesCategories.forEach(element => {
        categories.value.push(
            {
                name: element.title,
                str_id: element.str_id,
                id: element.id,
                sum: 0,
                limit: element.limit
            }
        );
    });
    loadingCategories.value = false;
};

const prepareData = async () => {
    loading.value = true;
    await loadExpCategories();
    await loadExpenses();
    defineExpenses();
    categories.value = categories.value.reduce((result, category) => {
        if (expenses.value[category.id] !== undefined && expenses.value[category.id].length) {
            result.push(category);
        }
        return result;
    }, []);
    initLoading.value = false;
    loading.value = false;
};

//handle add expenses btn
const $q = useQuasar();
const openAddExpenses = useOpenAddExpenses($q);
const handleAddExpense = () => {
    openAddExpenses.openModal({
        userId: props.userId
    });
};
const handleRowClick = (e, row) => {
    openAddExpenses.openModal({
        userId: props.userId,
        date: row.date,
        id: row.id,
        sum: row.sum,
        description: row.description,
        categoryStr: row.categoryStr
    });
};
// end handle add expenses btn

onMounted(() => {
    prepareData();
});

watch(
    () => mainStore.state.usersExpenses[props.userId], 
    () => {
        if (!initLoading.value) {
            nextTick(() => {
                if (!initLoading.value) {
                    prepareData();
                    //recalculate only neccessary part instad og rebuilding the whole array
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

<style lang="scss">
.expenses-table-wrapper table thead tr {
    background-color: $primary-light;
}
.sub-table-wrapper table thead tr {
    background-color: $secondary-light;
}
</style>