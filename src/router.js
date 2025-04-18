import { createMemoryHistory, createRouter } from 'vue-router';

import MainPage from '@/components/MainPage.vue';
import Login from '@/components/Login.vue';
import MainLayout from '@/components/layouts/MainLayout.vue';
import RatesSetting from '@/components/RatesSetting.vue';
import UserStats from '@/components/UserStats.vue';

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
            layout: MainLayout
        }
    },
    {
        path: '/user_stats/:id',
        name: 'user_stats',
        component: UserStats,
        meta: {
            layout: MainLayout
        }
    }
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

export default router;