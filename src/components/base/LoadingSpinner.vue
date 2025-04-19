<template>
    <div class="spinner-wrapper">
        <q-spinner-orbit
            class="q-mr-auto q-ml-auto block"
            color="primary"
            :size="size"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    size: {
        type: String,
        default: '2rem'
    }
});
</script>

<style lang="scss">
.spinner-wrapper {
    width: 100%;
}
</style>