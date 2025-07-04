<template>
    <h6> 
        Pediod: <span class="text-primary">{{ fixingPeriod.prevStr + ' - ' + fixingPeriod.nextStr }}</span>
    </h6> 
    <h6>
        Last state: <span>{{currentPseudoMonth}} - {{ lastSum }}&nbsp;{{ selectedCurrency.str_id }}</span>
    </h6>
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
        style="max-height: 100vh"
        class="rounded-borders"
    >
        <q-carousel-slide :name="state.pseudo_month" class="column no-wrap flex-center" v-for="(state) in states" :key="state.pseudo_month">
            <div class="q-mt-md text-center full-width full-height">
                <p class="text-primary">{{ state.date }}</p>
                <q-scroll-area style="max-height: 80vh; height: 100%;">
                    <div v-for="userData in state.users" :key="userData.user.id" class="q-py-xs full-width">
                        <p>{{ userData.user.name }}</p>
                        <q-separator inset class="q-mb-xs"/>
                        <div v-if="userData.data.length" v-for="data in userData.data" class="sum-item">
                            <p>{{ data.category.title }}</p>
                            <div class="sum-item-space"></div>
                            <span>{{ data.sum }}&nbsp;{{ data.currency.str_id }}</span>
                        </div>
                        <div v-else>
                            <p>no data</p>
                        </div>
                    </div>
                </q-scroll-area>
            </div>
        </q-carousel-slide>
    </q-carousel>
</template>

<script setup>
import { getAvailableDates, getDateRange, getPeriodsList } from '@/composables/getAvailableDates';
import { useMainStore } from '@/store/main';
import { computed, onMounted, ref } from 'vue';

const mainStore = useMainStore();
const props = defineProps(['dateRange', 'selectedCurrency']);

const slide = ref();

const currentPseudoMonth = ref();

const periodsList = computed(() => {
    return getPeriodsList(props.dateRange);
});

const states = computed(() => {
    return periodsList.value?.map((date) => {
        return {
            date: Object.values(date)[0],
            pseudo_month: Object.keys(date)[0],
            users: mainStore.state.users?.map(user => 
                ({
                    'user': user,
                    'data': mainStore.state.states?.filter(state => 
                            state.pseudo_month == Object.keys(date)[0] && state.user_id == user.id
                        ).map(item => {
                            const category = mainStore.state.stateCategories.find(el => el.id == item.category_id);
                            return {
                                'category': category,
                                'currency': mainStore.state.currencies.find(el => el.id == category.currency_id),
                                'sum': item.sum
                            };
                        })
                })
            )
        };
    });
});

const fixingPeriod = computed(() => {
    const availableDates = getAvailableDates();
    return availableDates; 
});

const lastSum = computed(() => {
    const selectedRate = props.selectedCurrency.rate;
    return mainStore.state.states?.filter(el => 
            el.pseudo_month == currentPseudoMonth.value
        )?.reduce((acc, el) => {
            const rate = mainStore.state.currencies?.find(el => el.id == el.currency_id)?.rate ?? 1;
            acc += Number(el.sum) / rate * selectedRate;
            return acc;
        }, 0) ?? 'no information';
});

onMounted(async () => {
    await mainStore.loadStateCategories();
    await mainStore.loadCurrentStates(props.dateRange);
    
    const dateRange = getDateRange(1);
    const currentPseudoMonthStr = dateRange[1].year + "-" + String(Number(dateRange[1].month + 1)).padStart(2, '0');
    slide.value = currentPseudoMonthStr;
    currentPseudoMonth.value = currentPseudoMonthStr;
});
</script>

<style lang="scss">
.sum-item {
    display: flex;
    justify-content: center;
}
.sum-item-space {
    min-width: 10px;
    width: 100%;
    max-width: 200px;
}
</style>