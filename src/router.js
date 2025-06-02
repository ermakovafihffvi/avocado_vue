import { createWebHistory, createRouter } from 'vue-router';

import MainPage from '@/components/MainPage.vue';
import Login from '@/components/Login.vue';
import MainLayout from '@/components/layouts/MainLayout.vue';
import RatesSetting from '@/components/RatesSetting.vue';
import UserStats from '@/components/UserStats.vue';
import AddCurrency from '@/components/buttons/AddCurrency.vue';
import UserStatsHeader from '@/components/headers/UserStats.vue';
import Currencies from './components/headers/Currencies.vue';

const routes = [
    { 
        path: '/',
        name: 'home', 
        component: MainPage,
        meta: {
            layout: MainLayout
        }
    },
    { 
        path: '/login',
        name: 'login', 
        component: Login 
    },
    {
        path: '/rates',
        name: 'rates',
        component: RatesSetting,
        meta: {
            layout: MainLayout,
            leftBtn: AddCurrency,
            title: Currencies
        }
    },
    {
        path: '/user_stats/:id',
        name: 'user_stats',
        component: UserStats,
        meta: {
            layout: MainLayout,
            title: UserStatsHeader
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;