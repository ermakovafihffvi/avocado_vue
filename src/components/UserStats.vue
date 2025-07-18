<template>
    <div class="user-stats-wrapper">
        <div class="q-gutter-y-md q-mr-auto q-ml-auto" style="max-width: 600px">
            <q-tab-panels v-model="mainStore.state.userStatsTab" animated class="tab-wrapper" style="background-color: transparent;">
                <q-tab-panel name="expenses">
                    <UserExpenses :userId="route.params.id" :userNameTitle="userNameTitle"/>
                </q-tab-panel>

                <q-tab-panel name="scheduled">
                    <ScheduledList :userId="route.params.id" :userNameTitle="userNameTitle"/>
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
import ScheduledList from '@/components/tables/ScheduledList.vue';
import { computed, onMounted } from 'vue';
import { useMainStore } from '@/store/main';

const route = useRoute();
const mainStore = useMainStore();

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

<style lang="sass" scoped>
@media (min-width: 641px) 
    .tab-wrapper
        width: 600px; 
</style>