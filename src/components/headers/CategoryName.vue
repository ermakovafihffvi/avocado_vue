<template>
    <h4 class="text-h4 text-primary text-center">{{ title }}</h4>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/store/main';
import { useRoute } from 'vue-router';

const mainStore = useMainStore();
const route = useRoute();

const title = computed(() => mainStore.state.expensesCategories?.find(i => i.id == route.params.category_id)?.title ?? '');
</script>
