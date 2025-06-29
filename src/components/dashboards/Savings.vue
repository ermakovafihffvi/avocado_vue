<template>
    states
</template>

<script setup>
import { useMainStore } from '@/store/main';
import { computed, onMounted } from 'vue';

const mainStore = useMainStore();
const props = defineProps(['dateRange']);

const states = computed(() => mainStore.state.states);

onMounted(async () => {
    await mainStore.loadCurrentStates(props.dateRange);
});
</script>