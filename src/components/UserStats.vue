<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
        <q-tab name="expenses" label="Expenses" />
        <q-tab name="incomes" label="Incomes" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="shadow-4 rounded-borders tab-wrapper">
        <q-tab-panel name="expenses">
            <UserExpenses :userId="route.params.id" :userNameTitle="userNameTitle"/>
        </q-tab-panel>

        <q-tab-panel name="incomes">
            <UserIncomes :userId="route.params.id" :userNameTitle="userNameTitle"/>
        </q-tab-panel>
    </q-tab-panels>
</div>
</div>

</template>

<script setup>
import { useRoute } from 'vue-router';
import UserIncomes from '@/components/tables/UserIncomes.vue';
import UserExpenses from '@/components/tables/UserExpenses.vue';
import { computed, onMounted, ref } from 'vue';
import { useMainStore } from '@/store/main';

const route = useRoute();
const mainStore = useMainStore();

const tab = ref('expenses');

//title
const currentUser = computed(() => {
    return mainStore.state.currentUser;
});
const userNameTitle = computed(() => { 
    return currentUser.value?.id == route.params.id ? 'My' 
        : mainStore.state.users?.find(item => item.id == route.params.id).name;
});
//end title

onMounted(() => {
    if (!currentUser.value) mainStore.getCurrentUser();
});

</script>

<style lang="scss" scoped>
@media (min-width: 641px) {
    .tab-wrapper {
        width: 600px;
    }
}
</style>