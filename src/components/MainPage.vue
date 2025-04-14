<template>
    <div>Main Page</div>
</template>

<script setup>
import useClient from '@/api/useClient';
import router from '@/router';
import { useMainStore } from '@/store/main';
import { onMounted } from 'vue';

const api = useClient();

const mainStore = useMainStore();

const loadData = async () => {
    console.log('ddd');
    console.log(mainStore.state.auth);
    if(!mainStore.state.auth) {
        console.log('ggg');
        const response = await fetch('http://avocado.test/sanctum/csrf-cookie', {
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
    } else {
        const { error, data } = await api('api/first').get().json();
        console.log(data);
        console.log(error);
    }
    
};

onMounted(() => {
    loadData();
});

</script>