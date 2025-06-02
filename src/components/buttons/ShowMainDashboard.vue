<template>
    <q-btn flat rounded icon="account_balance" color="primary" class="text-primary" @click="handleRightBtn">
        <span color="promary">Dashboards</span>
    </q-btn>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const handleRightBtn = () => {
    router.push('dashboards');
};
</script>