<template>
    <q-list padding class="text-primary">
        <q-item
            clickable
            v-ripple
            :active="link === 'home'"
            @click="menuItemClickHandle('home')"
            active-class="active-menu-link"
        >
            <q-item-section avatar>
                <q-icon name="home" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
        </q-item>

        <q-item
            clickable
            v-ripple
            :active="link === 'rates'"
            @click="menuItemClickHandle('rates')"
            active-class="active-menu-link"
        >
            <q-item-section avatar>
                <q-icon name="price_change" />
            </q-item-section>
            <q-item-section>Set Rates</q-item-section>
        </q-item>

        <q-item
            clickable
            v-ripple
            :active="link === 'category_exp'"
            @click="menuItemClickHandle('category_exp')"
            active-class="active-menu-link"
        >
            <q-item-section avatar>
                <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section>Expenses Categories</q-item-section>
        </q-item>

        <q-item
            clickable
            v-ripple
            :active="link === 'category_savings'"
            @click="menuItemClickHandle('category_savings')"
            active-class="active-menu-link"
        >
            <q-item-section avatar>
                <q-icon name="savings" />
            </q-item-section>
            <q-item-section>Savings Categories</q-item-section>
        </q-item>

        <q-item
            clickable
            v-ripple
            :active="link === 'dashboards'"
            @click="menuItemClickHandle('dashboards')"
            active-class="active-menu-link"
        >
            <q-item-section avatar>
                <q-icon name="account_balance" />
            </q-item-section>
            <q-item-section>Dashboards</q-item-section>
        </q-item>

        <q-expansion-item
            v-model="expanded_users"
            label="Money Users"
        >
            <q-item
                v-for="user in users"
                :key="user.id"
                clickable
                v-ripple
                :active="link === 'user_stats' +JSON.stringify({id: user.id})"
                @click="menuItemClickHandle('user_stats', {id: user.id})"
                active-class="active-menu-link"
            >
                <q-item-section avatar>
                    <q-icon name="person_outline" />
                </q-item-section>

                <q-item-section>{{ user.name }}</q-item-section>
            </q-item>
        </q-expansion-item>

        <q-separator spaced />

        <q-item>
            <q-btn class="absolute-center">Logout</q-btn>
        </q-item>
    </q-list>
</template>

<script setup>
import useClient from '@/api/useClient';
import router from '@/router';
import { useMainStore } from '@/store/main';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const api = useClient();
const mainStore = useMainStore();
const route = useRoute();

const expanded_users = ref(true);
const link = ref('home');
const users = ref([]);
const routeName = computed(() => route.name);

const menuItemClickHandle = (routeName, params = null) => {
    link.value = params ? routeName + JSON.stringify(params) : routeName;
    router.push({name: routeName, params: params});
};

const loadUserList = async () => {
    const { data, error } = await api('api/users-list').get().json();
    if (error.value) {
        //error
        //console.log(error.value);
        return;
    }
    mainStore.state.users = users.value = Array.from(data.value);
};

const setLinkValue = () => {
    if (route.name == 'user_stats') {
        link.value = 'user_stats' + JSON.stringify({id: route.params.id});
    } else {
        link.value = route.name;
    }
};

onMounted(() => {
    loadUserList();
    setLinkValue();
});

watch(routeName, () => {
    setLinkValue();
});
</script>

<style lang="scss">
.active-menu-link {
    background-color: $secondary-light;
}
</style>