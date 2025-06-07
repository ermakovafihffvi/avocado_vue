<template>
    <q-btn flat round color="negative" icon="sym_o_delete" size="md" @click="handleDelete"/>
</template>

<script setup>
const emit = defineEmits(['handleDelete']);

const handleDelete = () => {
    emit('handleDelete');
};
</script>