<template>
    <q-tabs v-model="mainStore.state.userStatsTab" 
        dense 
        class="text-grey" 
        active-color="primary" 
        indicator-color="primary" 
        align="justify" 
        narrow-indicator
    >
        <q-tab name="expenses" :label="$t('common.expense', 2)" />
        <q-tab name="scheduled" :label="$t('common.scheduled')" />
        <q-tab name="incomes" :label="$t('common.income', 2)" />
    </q-tabs>
</template>

<script setup>
import { useMainStore } from '@/store/main';

const mainStore = useMainStore();
</script>