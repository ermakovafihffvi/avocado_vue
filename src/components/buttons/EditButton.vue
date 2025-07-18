<template>
    <q-btn flat round color="primary" icon="sym_o_edit" size="md" @click.stop="handleEdit"/>
</template>

<script setup>
const emit = defineEmits(['handleEdit']);

const handleEdit = () => {
    emit('handleEdit');
};
</script>