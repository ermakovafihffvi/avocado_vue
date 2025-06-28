<template>
    <q-btn flat rounded icon="o_add" color="primary" class="text-primary" @click="handleAdd">
        <span color="promary">state category</span>
    </q-btn>
</template>

<script setup>
import useOpenAddStateCategory from '@/composables/openAddStateCategory';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const openAdd = useOpenAddStateCategory($q);
const handleAdd = () => {
    openAdd.openModal();
};
</script>