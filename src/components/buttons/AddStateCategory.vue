<template>
    <q-btn flat rounded icon="sym_o_add" color="primary" class="text-primary" @click="handleAdd">
        <span color="primary">state category</span>
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