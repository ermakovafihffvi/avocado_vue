import { createWebHistory, createRouter } from 'vue-router';

import MainPage from '@/components/MainPage.vue';
import Login from '@/components/Login.vue';
import MainLayout from '@/components/layouts/MainLayout.vue';
import RatesSetting from '@/components/RatesSetting.vue';
import UserStats from '@/components/UserStats.vue';
import AddCurrency from '@/components/buttons/AddCurrency.vue';
import UserStatsHeader from '@/components/headers/UserStats.vue';
import Currencies from '@/components/headers/Currencies.vue';
import ExpensesCategories from '@/components/ExpensesCategories.vue';
import SavingsCategories from '@/components/SavingsCategories.vue';
import ExpensesCategoriesHeader from '@/components/headers/ExpensesCategories.vue';
import MainDashboards from '@/components/MainDashboards.vue';
import ShowMainDashboard from '@/components/buttons/ShowMainDashboard.vue';
import AddExpCategory from '@/components/buttons/AddExpCategory.vue';
import SavingCategoriesHeader from '@/components/headers/SavingCategories.vue';
import AddSavingCategory from '@/components/buttons/AddSavingCategory.vue';
import MainDashboardHeader from '@/components/headers/MainDashboard.vue';
import AddState from './components/buttons/AddState.vue';
import SavingFix from './components/SavingFix.vue';
import StateCategories from './components/StateCategories.vue';
import AddStateCategory from './components/buttons/AddStateCategory.vue';
import StateCategoriesHeader from './components/headers/StateCategories.vue';

const routes = [
    { 
        path: '/',
        name: 'home', 
        component: MainPage,
        meta: {
            layout: MainLayout,
            rightBtn: ShowMainDashboard
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
            title: Currencies,
            rightBtn: ShowMainDashboard
        }
    },
    {
        path: '/category_exp',
        name: 'category_exp',
        component: ExpensesCategories,
        meta: {
            title: ExpensesCategoriesHeader,
            layout: MainLayout,
            rightBtn: ShowMainDashboard,
            leftBtn: AddExpCategory
        }
    },
    {
        path: '/category_savings',
        name: 'category_savings',
        component: SavingsCategories,
        meta: {
            title: SavingCategoriesHeader,
            layout: MainLayout,
            rightBtn: ShowMainDashboard,
            leftBtn: AddSavingCategory
        }
    },
    {
        path: '/category_states',
        name: 'category_states',
        component: StateCategories,
        meta: {
            title: StateCategoriesHeader,
            layout: MainLayout,
            rightBtn: ShowMainDashboard,
            leftBtn: AddStateCategory
        }
    },
    {
        path: '/dashboards',
        name: 'dashboards',
        component: MainDashboards,
        meta: {
            leftBtn: AddState,
            title: MainDashboardHeader,
            layout: MainLayout,
            rightBtn: ShowMainDashboard
        }
    },
    {
        path: '/user_stats/:id',
        name: 'user_stats',
        component: UserStats,
        meta: {
            layout: MainLayout,
            title: UserStatsHeader,
            rightBtn: ShowMainDashboard
        }
    },
    {
        path: '/add_state/:id?/:user_id?/:pseudo_month?',
        name: 'add_state',
        component: SavingFix,
        meta: {
            layout: MainLayout,
            rightBtn: ShowMainDashboard
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;