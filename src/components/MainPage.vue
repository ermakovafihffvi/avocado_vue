<template>
    <TotalIncomes />
    <div class="q-mt-lg">
        <TotalExpenses />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import TotalExpenses from './tables/TotalExpenses.vue';
import TotalIncomes from './tables/TotalIncomes.vue';
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';

const api = useClient();
const mainStore = useMainStore();

const loadCurrencies = async () => {
    if (!mainStore.state.currencies) {
        const { data, error } = await api('api/currencies').get().json(); 
        if (error.value) {
            //error
            //console.log(error.value);
        }
        mainStore.state.currencies = data.value;
    }
};

const loadCategories = async () => {
    if (!mainStore.state.expensesCategories) {
        const { data, error } = await api('api/expenses-categories').get().json();
        if (error.value) {
            //error
            //console.log(error.value);
        }
        mainStore.state.expensesCategories = data.value;
    }
};

onMounted(() => {
    loadCurrencies();
    loadCategories();
});

</script>