<template>
    <q-btn flat rounded icon="o_add" color="primary" class="text-primary" @click="handleAdd">
        <span color="promary">add state</span>
    </q-btn>
</template>

<script setup>
import router from '@/router';

const handleAdd = () => {
    router.push({name: 'add_state'});    
};
</script>