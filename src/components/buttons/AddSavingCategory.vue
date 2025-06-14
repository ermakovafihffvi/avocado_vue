<template>
    <q-btn flat rounded icon="o_add" color="primary" class="text-primary" @click="handleAdd">
        <span color="promary">category</span>
    </q-btn>
</template>

<script setup>
import useOpenAddSavingCategory from '@/composables/openAddSavingCategory';
import { useQuasar } from 'quasar';


//handle add currency btn
const $q = useQuasar();
const openAdd = useOpenAddSavingCategory($q);
const handleAdd = () => {
    openAdd.openModal();
};
// end handle add currency btn
</script>