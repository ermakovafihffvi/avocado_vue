<template>
    <div v-if="fixingPeriod && lastSum">
        <h6> 
            Last pediod: <span class="text-primary">{{ fixingPeriod.prevStr + ' - ' + fixingPeriod.nextStr }}</span>
        </h6> 
        <h6>
            Last state: <span class="text-primary">{{ lastSum }}</span>
        </h6>
    </div>
    <q-carousel
        v-model="slide"
        transition-prev="jump-right"
        transition-next="jump-left"
        swipeable
        animated
        control-color="primary"
        navigation
        arrows
        style="max-height: 100vh"
        class="rounded-borders q-pb-xl"
    >
        <q-carousel-slide :name="state.pseudo_month" class="column no-wrap flex-center" v-for="(state) in states" :key="state.pseudo_month">
                <q-scroll-area class="fit">
                    <div class="bg-white item-date">
                        <p class="text-center text-primary">{{ state.date }}</p>
                    </div>
                    <div v-for="userData in state.users" :key="userData.user.id" class="q-py-md full-width">
                        <p class="text-center text-dark text-bold">{{ userData.user.name }}</p>
                        <q-separator inset class="q-mb-xs"/>
                        <q-btn v-if="userData.data.length" v-for="data in userData.data" 
                            class="full-width sum-item-btn q-mb-xs" text-color="black"
                            @click="router.push({ name: 'add_state', params: { id: data.id } })"
                        >
                            <div class="row justify-between no-wrap text-left full-width">
                                <p class="q-my-none content-center">{{ data.category.title }}</p>
                                <div class="sum-item-space"></div>
                                <p class="q-my-none content-center">{{ data.sum }}&nbsp;{{ data.currency.str_id }}</p>
                            </div>
                        </q-btn>
                        <q-btn v-if="!userData.data.length || !allFixer.isAllFixed(state.pseudo_month)"
                            class="full-width sum-item-btn q-mb-xs add-state-btn" text-color="black"
                            @click="router.push({ name: 'add_state', params: { id: 0, user_id: userData.user.id, pseudo_month: state.pseudo_month } })"
                            icon="o_add" label="add state"
                        />
                    </div>
                </q-scroll-area>
        </q-carousel-slide>
    </q-carousel>
</template>

<script setup>
import { getAvailableDates, getPeriodsList } from '@/composables/getAvailableDates';
import useAllFixed from '@/composables/useAllFixed';
import router from '@/router';
import { useMainStore } from '@/store/main';
import { useDateFormat } from '@vueuse/core';
import { computed, onMounted, ref, watch } from 'vue';

const mainStore = useMainStore();
const props = defineProps(['dateRange', 'selectedCurrency']);
const allFixer = useAllFixed();

const slide = ref();

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
                                'id': item.id,
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

const fixingPeriod = ref();

const lastSum = computed(() => {
    return Number(mainStore.state.lastState) ? (Number(mainStore.state.lastState) * Number(props.selectedCurrency.rate)).toFixed(2) + ' ' + props.selectedCurrency.str_id : null;
});

const prepareData = async () => {
    await mainStore.loadStateCategories();
    await mainStore.loadCurrentStates(props.dateRange);
    
    fixingPeriod.value = getAvailableDates();
    slide.value = useDateFormat(new Date(props.dateRange[1].year + '/' + (props.dateRange[1].month + 1) + '/22'), 'YYYY-MM', { locale: 'en-US' }).value;
};

onMounted(() => {
    prepareData();
});

watch(
    () => props.dateRange, 
    () => {
        prepareData();
    },
    { deep: true }
);

watch(
    () => props.selectedCurrency, 
    () => {
        prepareData();
    },
    { deep: true }
);
</script>

<style lang="scss" scoped>
.item-date {
    position: sticky;
    top: 0
}
.sum-item-space {
    min-width: 15px;
}
.sum-item-btn {
    &:active::before, &::before {
        box-shadow: none !important;
    }
}
.add-state-btn {
    background-color: $secondary-light;
}
</style>