<template>
    <UserExpenses :userId="userId"/>
    <UserIncomes :userId="userId"/>
</template>

<script setup>
import { useRoute } from 'vue-router';
import UserIncomes from '@/components/tables/UserIncomes.vue';
import UserExpenses from '@/components/tables/UserExpenses.vue';

const route = useRoute();
const userId = ref(route.params.id);

</script>