<template>
    <h4 class="text-h4 q-mb-md text-primary">My Expenses</h4>
    <LoadingSpinner v-if="loading" :size="'lg'"/>
</template>

<script setup>
import { ref } from 'vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';

const loading = ref(true);

</script>