<template>
    <q-btn flat rounded icon="sym_o_add" color="primary" class="text-primary" @click="handleAdd">
        <span color="primary">{{ $t('common.add') }} {{ $t('common.state') }}</span>
    </q-btn>
</template>

<script setup>
import router from '@/router';

const handleAdd = () => {
    router.push({name: 'add_state'});    
};
</script>