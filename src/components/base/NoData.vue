<template>
    <img v-if="usePic"
        src="@/assets/avocado_sl.png"
        style="max-width: 300px; width: fill-available; display: block;"
        class="q-mx-auto q-mb-lg"
    />
    <div class="full-width row flex-center">
        <q-icon size="1.5em" name="warning" />
        <span>{{ $t('common.no_data') }}</span>
    </div>
</template>

<script setup>
const props = defineProps({
    usePic: {
        required: false,
        default: false,
        type: Boolean
    }
});
</script>
