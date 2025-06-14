<template>
    <div class="card-title-wrapper q-pa-md">
        <div class="text-title-wrapper">
            <h6 class="text-h6 text-primary">{{ userNameTitle ? userNameTitle + ' Expenses' : '' }}</h6>
            <div class="column">
                <span class="text-primary" :class="{ 'text-h5': !userSumsWOMax.length }">
                    {{ userSum[maxUserSumKey] }}&nbsp;{{ mainStore.state.currencies?.find(el => el.id == maxUserSumKey)?.str_id }}
                </span>
                <span class="text-primary" v-for="value in userSumsWOMax">
                    {{ value.value }}&nbsp;{{ mainStore.state.currencies?.find(el => el.id == value.key)?.str_id }}
                </span>
            </div>
        </div>
        <q-btn push color="primary" label="Add expense" @click="handleAddExpense" />
    </div>
    <LoadingSpinner v-if="loading" :size="'lg'" />
    <div class="expenses-table-wrapper" v-else>
        <q-table flat bordered
            :rows="categories" 
            :columns="columns" 
            row-key="str_id" 
            hide-pagination
            :pagination="{
                rowsPerPage: 0
            }"
            v-model:expanded="expanded"
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
                        {{ col.name == 'name' ? col.value + ', ' + props.row.currency_str : col.value }}
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
                                <template v-slot:body-cell-delete="props">
                                    <q-td :props="props" @click.stop>
                                        <DeleteButton @handle-delete="handleDelete(props.row.id)"/>
                                    </q-td>
                                </template>
                                <template v-slot:item="subProps">
                                    <div
                                        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                                        @click="(e) => handleRowClick(e, subProps.row)"
                                    >
                                        <q-card bordered flat>
                                            <q-card-section>
                                                <q-list dense>
                                                    <q-item v-for="col in subProps.cols" :key="col.name">
                                                        <q-item-section>
                                                            <div v-if="col.name == 'delete'" @click.stop class="card-delete-wrapper">
                                                                <DeleteButton
                                                                    @handle-delete="handleDelete(subProps.row.id)" 
                                                                />
                                                            </div>
                                                            <q-item-label v-else>{{ col.label }}</q-item-label>
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
import DeleteButton from '@/components/buttons/DeleteButton.vue';

const api = useClient();
const mainStore = useMainStore();
const props = defineProps({
    userId: [String, Number],
    userNameTitle: String
});

const expanded = ref([]);
const loadingExpenses = ref(true);
const loadingCategories = ref(true);
const loading = ref(true);
const initLoading = ref(true);
const expenses = ref({});
const categories = ref([]);
const userSum = ref({});

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
    },
    {
        name: 'delete',
        required: true,
        label: 'Delete',
        align: 'left'
    }
];

const resetData = () => {
    expenses.value = {};
    userSum.value = {};
    categories.value.forEach(item => item.sum = 0);
};

const defineExpenses = () => {
    resetData();
    mainStore.state.usersExpenses[props.userId]?.forEach((item) => {
        const category = categories.value.find(el => el.id == item.category_id);
        if (typeof category !== 'undefined') {
            category.sum += Number(item.sum);
            if (!userSum.value[category.currency_id]) {
                userSum.value[category.currency_id] = 0;
            }
            userSum.value[category.currency_id] += Number(item.sum);
            if (!(item.category_id in expenses.value)) {
                expenses.value[item.category_id] = [];
            }
            expenses.value[item.category_id].push({
                sum: item.sum,
                id: item.id,
                description: item.desc,
                date: useDateFormat(item.created_at, 'YYYY-MM-DD'),
                categoryStr: category.str_id,
                categoryId: category.id
            });
        }
    });
};

const loadExpenses = async () => {
    loadingExpenses.value = true;
    expenses.value = {};
    if (typeof mainStore.state.usersExpenses[props.userId] === 'undefined' || mainStore.state.usersExpenses[props.userId] == 'null') {
        const { data, error } = await api('api/expense/user/' + props.userId + '/?special=0').get().json();
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
        const { data, error } = await api('api/expense/categories?special=0').get().json();
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
                limit: element.limit,
                currency_id: element.currency_id,
                currency_str: mainStore.state.currencies.find(item => item.id == element.currency_id)?.str_id
            }
        );
    });
    loadingCategories.value = false;
};

const prepareData = async () => {
    loading.value = true;
    await mainStore.loadCurrencies();
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
        categoryId: row.categoryId
    });
};
// end handle add expenses btn

const handleDelete = async (id) => {
    const { error } = await api(`/api/expense/${id}/delete`).delete().json();
    if (error.value) {

    } else {
        mainStore.state.usersExpenses[props.userId] = mainStore.state.usersExpenses[props.userId].reduce(function (acc, item) {
            if (item.id !== id) {
                acc.push(item);
            }
            return acc;
        }, []);
    }
};

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
.card-delete-wrapper {
    width: fit-content;
    align-self: end;
}
</style>

<style lang="sass" scoped>
@media (min-width: $breakpoint-sm-min)
    .expenses-table-wrapper
        padding: 16px;  
</style>