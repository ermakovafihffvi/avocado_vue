<template>
    <q-btn flat round color="positive" icon="sym_o_save" size="md" @click.stop="handleSave"/>
</template>

<script setup>
const emit = defineEmits(['handleSave']);

const handleSave = () => {
    emit('handleSave');
};
</script>