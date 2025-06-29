<template>
    <h6>Current 
        <span class="text-primary">({{ fixingPeriod.prevStr + ' - ' + fixingPeriod.nextStr }})</span>: 
        <span>{{ lastSum }}$</span>
    </h6> 
    <h6>History:</h6>
    <q-carousel
        v-model="slide"
        transition-prev="jump-right"
        transition-next="jump-left"
        swipeable
        animated
        control-color="primary"
        navigation
        padding
        arrows
        height="300px"
        class="shadow-1 rounded-borders"
    >
        <q-carousel-slide :name="index" class="column no-wrap flex-center" v-for="(user, index) in users" :key="user.id">
          <div class="q-mt-md text-center">
            {{ user.name }}
          </div>
        </q-carousel-slide>
    </q-carousel>
</template>

<script setup>
import { getAvailableDates, getDateRange } from '@/composables/getAvailableDates';
import { useMainStore } from '@/store/main';
import { computed, onMounted, ref } from 'vue';

const mainStore = useMainStore();
const props = defineProps(['dateRange']);

const slide = ref(0);

const currentPseudoMonth = computed(() => {
    let dateRange = getDateRange(1);
    return dateRange[1].year + "-" + String(Number(dateRange[1].month + 1)).padStart(2, '0');
});

const states = computed(() => mainStore.state.states);

const users = computed(() => mainStore.state.users);

const fixingPeriod = computed(() => {
    const availableDates = getAvailableDates();
    return availableDates; 
});

const lastSum = computed(() => {
    return mainStore.state.states?.filter(el => el.pseudo_month == currentPseudoMonth.value)?.reduce((acc, el) => acc += Number(el.sum), 0);
});

onMounted(async () => {
    await mainStore.loadCurrentStates(props.dateRange);
});
</script>