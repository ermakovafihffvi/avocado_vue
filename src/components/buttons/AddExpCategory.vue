<template>
    <q-btn flat rounded icon="sym_o_add" color="primary" class="text-primary" @click="handleAdd">
        <span color="primary">category</span>
    </q-btn>
</template>

<script setup>
import useOpenAddExpCategory from '@/composables/openAddExpCategory';
import { useQuasar } from 'quasar';


//handle add currency btn
const $q = useQuasar();
const openAdd = useOpenAddExpCategory($q);
const handleAdd = () => {
    openAdd.openModal();
};
// end handle add currency btn
</script>