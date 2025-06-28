<template>
    <div class="category-card">
    <div class="flex justify-center q-mb-md">
        <VueDatePicker 
            v-model="dateRange"
            :month-picker="true"
            :format="'MM/yyyy'"
            :range="{}"
        />
    </div>
    <q-tab-panels v-model="mainStore.state.mainDashboardTab" animated class="shadow-4 rounded-borders tab-wrapper" v-if="!loading">
        <q-tab-panel name="savings">
            <Savings :dateRange="dateRange"/>
        </q-tab-panel>

        <q-tab-panel name="expenses">
            <Expenses :dateRange="dateRange"/>
        </q-tab-panel>

        <q-tab-panel name="incomes">
            <Incomes :dateRange="dateRange"/>
        </q-tab-panel>
    </q-tab-panels>
    </div>
</template>

<script setup>
import { useMainStore } from '@/store/main';
import Savings from './dashboards/Savings.vue';
import Expenses from './dashboards/Expenses.vue';
import Incomes from './dashboards/Incomes.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { onMounted, ref } from 'vue';

const mainStore = useMainStore();

const dateRange = ref([]);
const loading = ref(true);

onMounted(async () => {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 5);

    dateRange.value[1] = {
        "month": now.getMonth(),
        "year": now.getFullYear()
    };
    dateRange.value[0] = {
        "month": sixMonthsAgo.getMonth(),
        "year": sixMonthsAgo.getFullYear()
    };
    await mainStore.loadCurrencies();
    loading.value = false;
});
</script>

<style lang="scss" scoped>
//TO DO 29.06:
//styles for mobile dashboards
//saving states
//states dashboard
//validation (optional)
//currency setting for expenses dashboard and incomes!!!
.category-card {
    margin-bottom: 20px;
    margin-right: auto;
    margin-left: auto;
}
</style>

<style lang="sass" scoped>
@media (min-width: 641px) 
    .category-card
        width: 600px; 
@media (min-width: 850px) 
    .category-card
        width: 800px; 
</style>