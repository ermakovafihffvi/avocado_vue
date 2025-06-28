<template>
    states
</template>

<script setup>
import useClient from '@/api/useClient';
import { onMounted } from 'vue';

const api = useClient();
const props = defineProps(['dateRange']);

onMounted(async () => {
    const { data, error } = await api('api/dashboard/last_states').post({
        date: props.dateRange
    }).json();
    if (error.value) {
        console.error(error.value);
        //TO DO
    } else {
        console.log(data.value);
    }

});
</script>