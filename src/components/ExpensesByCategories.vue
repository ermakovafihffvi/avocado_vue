<template>
    <LoadingSpinner v-if="loading" class="q-mt-lg"/>
    <div class="q-mt-xl q-py-md q-gutter-y-md q-mr-auto q-ml-auto q-px-md" v-else style="max-width: 600px;">
        <DetailedExpensesByCategory :users="users" :category="category"/>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DetailedExpensesByCategory from '@/components/blocks/DetailedExpensesByCategory.vue';
import { useMainStore } from '@/store/main';
import useClient from '@/api/useClient';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import { useRoute } from 'vue-router';

const mainStore = useMainStore();
const route = useRoute();
const api = useClient();

const categoryId = computed(() => route.params.category_id);

const loading = ref(true);
const users = computed(() => mainStore.state.users);
const category = computed(() => mainStore.state.expensesCategories?.find(i => i.id == categoryId.value));

const loadExpenses = async () => {
    const reqData = {
        users: users.value.map(i => i.id),
        categories: [category?.id], 
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

const prepateData = async () => {
    loading.value = true;
    await mainStore.loadUsersList();
    await loadExpenses();
    loading.value = false;
};

onMounted(() => {
    prepateData();
});

</script>
