import { createWebHistory, createRouter } from 'vue-router';
import { useMainStore } from '@/store/main';

import MainPage from '@/components/MainPage.vue';
import Login from '@/components/Login.vue';
import MainLayout from '@/components/layouts/MainLayout.vue';
import CurrencySettings from '@/components/CurrencySettings.vue';
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
import AddState from '@/components/buttons/AddState.vue';
import SavingFix from '@/components/SavingFix.vue';
import StateCategories from '@/components/StateCategories.vue';
import AddStateCategory from '@/components/buttons/AddStateCategory.vue';
import StateCategoriesHeader from '@/components/headers/StateCategories.vue';
import ExpensesByCategories from '@/components/ExpensesByCategories.vue';
import CategoryName from '@/components/headers/CategoryName.vue';
import MyPage from '@/components/MyPage.vue';
import ManageUsers from '@/components/ManageUsers.vue';

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
        path: '/currencies',
        name: 'currencies',
        component: CurrencySettings,
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
        path: '/expenses/category/:category_id',
        name: 'expenses_by_category',
        component: ExpensesByCategories,
        meta: {
            title: CategoryName,
            layout: MainLayout
        }
    },
    /*{
        path: '/category_savings',
        name: 'category_savings',
        component: SavingsCategories,
        meta: {
            title: SavingCategoriesHeader,
            layout: MainLayout,
            rightBtn: ShowMainDashboard,
            leftBtn: AddSavingCategory
        }
    },*/
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
    },
    {
        path: '/me',
        name: 'me',
        component: MyPage,
        meta: {
            layout: MainLayout,
        }
    },
    {
        path: '/manage-users',
        name: 'manage-users',
        beforeEnter: (to, from) => {      
            const mainStore = useMainStore();
            return mainStore.state.currentUser?.isAdmin;
        },
        component: ManageUsers,
        meta: {
            layout: MainLayout
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;