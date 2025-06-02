<template>
    <q-tabs v-model="mainStore.state.userStatsTab" 
        dense 
        class="text-grey" 
        active-color="primary" 
        indicator-color="primary" 
        align="justify" 
        narrow-indicator
    >
        <q-tab name="expenses" label="Expenses" />
        <q-tab name="incomes" label="Incomes" />
    </q-tabs>
</template>

<script setup>
import { useMainStore } from '@/store/main';

const mainStore = useMainStore();
</script>