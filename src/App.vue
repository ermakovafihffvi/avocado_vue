<template>
    <component :is="$route.meta.layout || 'div'">
        <RouterView/>
    </component>
</template>

<script setup>
import { RouterView } from 'vue-router';
import router from '@/router';
import { useMainStore } from '@/store/main';
import { onMounted } from 'vue';

const mainStore = useMainStore();

const loadData = async () => {
	console.log('test');
console.log(mainStore.auth);
console.log(document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN=')));
    if(!mainStore.state.auth && !document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))) {
        const response = await fetch('http://89.223.69.93/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'include',
            headers: {
            'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            console.warn('Failed to get CSRF cookie');
        } else {
            mainStore.state.auth = true;
            router.push('/login');
        }
    }
};

onMounted(() => {
    loadData();
});
</script>

<style scoped>

</style>
