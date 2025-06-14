<template>
    <div class="flex justify-center q-mb-md">
        <q-date
            v-model="dateRange "
            landscape
            range
            default-view="Months"
            mask="YYYY-MM"
            :options="optionsFn2"
        />
    </div>
    <q-tab-panels v-model="mainStore.state.mainDashboardTab" animated class="shadow-4 rounded-borders tab-wrapper">
        <q-tab-panel name="savings">
            <Savings :dataRange="dateRange"/>
        </q-tab-panel>

        <q-tab-panel name="expenses">
            <Expenses :dataRange="dateRange"/>
        </q-tab-panel>

        <q-tab-panel name="incomes">
            <Incomes :dataRange="dateRange"/>
        </q-tab-panel>
    </q-tab-panels>
</template>

<script setup>
import { useMainStore } from '@/store/main';
import Savings from './dashboards/Savings.vue';
import Expenses from './dashboards/Expenses.vue';
import Incomes from './dashboards/Incomes.vue';
import { onMounted, ref } from 'vue';

const mainStore = useMainStore();

const dateRange = ref({
    to: '',
    from: ''
});

function getMonthString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

const optionsFn2 = (date) => {
    const parts = date.split('/');
    return parts[ 2 ] % mainStore.state.xDate === 0;
};

onMounted(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 5);

    dateRange.value.to = getMonthString(now);
    dateRange.value.from = getMonthString(sixMonthsAgo);
});
</script>

<style lang="scss">
.q-date {
    .q-date__header-title {
        display: none !important;
    }
}
</style>