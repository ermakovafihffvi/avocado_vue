<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
        <q-tab name="expenses" label="Expenses" />
        <q-tab name="incomes" label="Incomes" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="shadow-4 rounded-borders">
        <q-tab-panel name="expenses">
            <UserExpenses :userId="userId" />
        </q-tab-panel>

        <q-tab-panel name="incomes">
            <UserIncomes :userId="userId" />
        </q-tab-panel>
    </q-tab-panels>
</div>
</div>

</template>

<script setup>
import { useRoute } from 'vue-router';
import UserIncomes from '@/components/tables/UserIncomes.vue';
import UserExpenses from '@/components/tables/UserExpenses.vue';
import { ref } from 'vue';

const route = useRoute();
const userId = ref(route.params.id);

const tab = ref('expenses');

</script>