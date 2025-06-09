<template>
    <q-btn flat rounded icon="o_add" color="primary" class="text-primary" @click="handleAdd">
        <span color="promary">category</span>
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