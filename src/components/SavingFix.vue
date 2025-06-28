<template>
    <q-card>
        <q-card-section>
            <h5>Period: <span class="text-primary">{{ fixingPeriod.prevStr + ' - ' + fixingPeriod.nextStr }}</span></h5>
        </q-card-section>
        <q-card-section>
            
            <q-btn push color="primary" label="Fix" />
        </q-card-section>
    </q-card>
</template>

<script setup>
import { getAvailableDates } from '@/composables/getAvailableDates';
import { useMainStore } from '@/store/main';
import { computed, onMounted } from 'vue';

const mainStore = useMainStore();

const stateCategories = computed(() => mainStore.state.stateCategories);
const users = computed(() => mainStore.state.users);

const fixingPeriod = computed(() => {
    const availableDates = getAvailableDates();
    return availableDates; 
});

onMounted(() => {
    mainStore.loadStateCategories();
});

</script>