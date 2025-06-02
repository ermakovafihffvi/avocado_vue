<template>
    <q-layout view="lHr lpr lFr">
        <q-header class="header-wrapper" height-hint="98">
            <q-toolbar class="bg-primary text-white">
                <q-toolbar-title>Avocado Money</q-toolbar-title>
            </q-toolbar>

            <div v-if="$route.meta.title" class="title-wrapper">
                <component :is="$route.meta.title"></component>
                <q-separator />
            </div>
        </q-header>

        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
            <MenuList />
        </q-drawer>

        <q-page-container class="page-container-wrapper">
            <slot />
        </q-page-container>

        <q-footer class="shadow-up-3 footer-wrapper">
            <q-toolbar class="justify-between full-height">
                <q-btn color="primary" flat round icon="menu" @click="toggleLeftDrawer" />
                <div class="footer-sub-button-wrapper footer-sub-button-left">
                    <component v-if="$route.meta.leftBtn" :is="$route.meta.leftBtn"></component>
                </div>
                <div style="width: 60px;"></div>
                <q-btn round class="absolute-center shadow-2" style="top: 0" @click="handleAddExpense">
                    <q-avatar size="60px">
                        <img src="@/assets/avocado70.png">
                    </q-avatar>
                </q-btn>
                <div class="footer-sub-button-wrapper footer-sub-button-right">
                    <component v-if="$route.meta.rightBtn" :is="$route.meta.rightBtn"></component>
                </div>
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

<style lang="scss" scoped>
.header-wrapper {
    background-color: var(--color-background) !important;
}
.title-wrapper {
    max-width: 600px;
    margin-right: auto;
    margin-left: auto;
    padding-top: 20px;
    padding-bottom: 20px;
}
.page-container-wrapper {
    padding-top: 90px !important;
}
.footer-wrapper {
    height: 80px;
    background-color: var(--color-background) !important;
}
.footer-sub-button-wrapper {
    width: 50%;
    display: flex;
    justify-content: center;
}
.footer-sub-button-left button {
    margin-right: 20px;
}
.footer-sub-button-right {
    margin-left: 20px;
}
</style>