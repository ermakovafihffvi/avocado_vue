<template>
    <h6 class="text-h6 q-mb-md text-primary">My Expenses</h6>
    <LoadingSpinner v-if="loading" :size="'lg'"/>
</template>

<script setup>
import { ref } from 'vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';

const props = defineProps({
    userId: [String, Number]
});
const loading = ref(true);

</script>