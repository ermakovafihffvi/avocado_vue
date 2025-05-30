<template>
    <q-layout view="lHr lpr lFr">
        <q-header class="bg-primary text-white" height-hint="98">
            <q-toolbar>
                <q-toolbar-title>Avocado Money</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
            <MenuList />
        </q-drawer>

        <q-page-container>
            <slot />
        </q-page-container>

        <q-footer class="bg-white shadow-up-3">
            <q-toolbar class="justify-between">
                <q-btn color="primary" flat round icon="menu" @click="toggleLeftDrawer" />
                <q-btn round class="absolute-center shadow-2" style="top: 0" @click="handleAddExpense">
                    <q-avatar size="60px">
                        <img src="@/assets/avocado70.png">
                    </q-avatar>
                </q-btn>
                <q-btn color="primary" flat round icon="home" @click="router.push('/')"/>
            </q-toolbar>
        </q-footer>
    </q-layout>
</template>

<script setup>
import MenuList from '@/components/MenuList.vue';
import useOpenAddExpenses from '@/composables/openAddExpense';
import router from '@/router';
import { useMainStore } from '@/store/main';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

const mainStore = useMainStore();

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
};

//handle add expenses btn
const $q = useQuasar();
const openAddExpenses = useOpenAddExpenses($q);
const handleAddExpense = () => {
    openAddExpenses.openModal({
        userId: mainStore.state.currentUser?.id
    });
};
// end handle add expenses btn
</script>