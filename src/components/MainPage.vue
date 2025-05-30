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
import { useMainStore } from '@/store/main';

const mainStore = useMainStore();

onMounted(() => {
    mainStore.loadCurrencies();
    mainStore.loadExpCategories();
});

</script>