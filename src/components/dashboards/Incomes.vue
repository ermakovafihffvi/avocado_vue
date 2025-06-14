<template>
    incomes
    <div id="chart"></div>
</template>

<script setup>
import useClient from '@/api/useClient';
import { onMounted } from 'vue';

const props = defineProps(['dataRange']);
const api = useClient();

onMounted(async () => {
    const { data, error } = await api('api/dashboard/last_incomes').post({
        from: props.dataRange.from,
        to: props.dataRange.to
    }).json();

    if (error.value) {
        //TO DO
    }

});
</script>