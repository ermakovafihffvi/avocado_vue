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
                <q-btn round class="absolute-center shadow-2" style="top: 0" @click="router.push('/')">
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
import router from '@/router';
import { ref } from 'vue';

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
};
</script>