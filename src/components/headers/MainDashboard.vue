<template>
    <q-tabs v-model="mainStore.state.mainDashboardTab" 
        dense 
        class="text-grey" 
        active-color="primary" 
        indicator-color="primary" 
        align="justify" 
        narrow-indicator
    >
        <q-tab name="states" :label="$t('common.state', 2)" />
        <q-tab name="expenses" :label="$t('common.expense', 2)" />
        <q-tab name="incomes" :label="$t('common.income', 2)" />
    </q-tabs>
</template>

<script setup>
import { useMainStore } from '@/store/main';

const mainStore = useMainStore();
</script>