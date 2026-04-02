<template>
    <loading-spinner v-if="loading"/>
    <q-carousel v-else
        v-model="slide"
        transition-prev="jump-right"
        transition-next="jump-left"
        swipeable
        animated
        control-color="primary"
        arrows
        class="rounded-borders q-pb-xl"
    >
        <q-carousel-slide :name="category.str_id" v-for="(category) in categories" :key="category.id" class="column no-wrap flex-center">
            <p class="text-center text-primary text-weight-bold text-h6 q-mt-md">{{ category.title }}</p>
            <q-scroll-area class="fit">
                <div class="column no-wrap flex-center">
                    <DetailedExpensesByCategory :users="users" :category="category" :expanded="true" :deletion-allowed="false"/>
                </div>
            </q-scroll-area>
        </q-carousel-slide>
    </q-carousel>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useMainStore } from '@/store/main';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import useClient from '@/api/useClient';
import { getDateRange } from '#shared/dates/helpers.js';
import DetailedExpensesByCategory from '@/components/blocks/DetailedExpensesByCategory.vue';
import { useQuasar } from 'quasar';

const mainStore = useMainStore();
const api = useClient();
const $q = useQuasar();

const props = defineProps(['dateRange']);

const loading = ref(true);
const users = computed(() => mainStore.state.users);
const categories = computed(() => mainStore.state.expensesCategories?.filter(i => i.isActive && !i.special) ?? []);
const slide = ref();

const loadExpenses = async () => {
    const { start, end } = getDateRange(props.dateRange);
    const reqData = {
        dateRange: {
            from: start, 
            end: end
        },
        users: mainStore.state.users.map(i => i.id),
        categories: categories.value.map(i => i.id), 
        special: 0
    };
    const { error, data } = await api('api/expense/load').post(reqData).json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
        return;
    } else {
        Array.from(users.value ?? []).forEach(user => {
            mainStore.state.usersExpenses[user.id] = data.value.filter(i => i.user_id == user.id);
        });
    }
};

const loadBaseData = async () => {
    mainStore.loadUsersList();
    mainStore.loadExpCategories();
};

const loadData = async () => {
    loading.value = true;
    await loadBaseData();
    await loadExpenses();
    loading.value = false;
    slide.value = categories.value[0].str_id;
};

onMounted(() => {
    loadData();
});
</script>

<style lang="scss" scoped>
.carousel-expenses {
    color: var(--q-dark-page);
}
</style>
