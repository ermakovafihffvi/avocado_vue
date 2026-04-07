<template>
    <component :is="$route.meta.layout || 'div'">
        <RouterView/>
    </component>
    <PiniaColadaDevtools  />
</template>

<script setup>
import { PiniaColadaDevtools } from '@pinia/colada-devtools';
import { RouterView, useRouter } from 'vue-router';
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import { onMounted } from 'vue';

const mainStore = useMainStore();
const api = useClient();
const router = useRouter();

const loadData = async () => {
    const { data, error } = await api('api/current-user').get().json();
    if (error.value) {
        mainStore.state.auth = false;
        mainStore.state.currentUser = null;
        router.push('/login');
    } else {
        mainStore.state.auth = true;
        mainStore.state.currentUser = data.value;
        //router.push('/');
    }
};

onMounted(() => {
    loadData();
});
</script>

<style scoped>

</style>
