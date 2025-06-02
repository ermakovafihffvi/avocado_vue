<template>
    <q-btn flat rounded icon="o_add" color="primary" class="text-primary" @click="handleAddCurrency">
        <span color="promary">currency</span>
    </q-btn>
</template>

<script setup>
import useOpenAddCurrency from '@/composables/openAddCurrency';
import { useQuasar } from 'quasar';


//handle add currency btn
const $q = useQuasar();
const openAddExpenses = useOpenAddCurrency($q);
const handleAddCurrency = () => {
    openAddExpenses.openModal();
};
// end handle add currency btn
</script>