import useClient from '@/api/useClient';
import { defineStore } from 'pinia'
import { reactive } from 'vue';

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore('main', () => {
    const state = reactive({ 
        auth: false,
        users: null,
        currencies: null,
        expensesCategories: null,
        userStatsTab: 'expenses',
        mainDashboardTab: 'savings',
        currentUser: null,
        usersExpenses: {},
        usersIncomes: {},
        savingCategories: null,
        allExpensesCategoriesReloadable: null,
        xDate: 22,
        stateCategories: null,
        states: null
    });

    const api = useClient();

    const getCurrentUser = async () => {
        if (state.currentUser && state.currentUser.id > 0) return state.currentUser;
        const { data, error } = await api('api/current-user').get().json();
        if (error.value) {
            console.error(error.value);
            return null;
        }
        state.currentUser = data.value;
        return state.currentUser;
    };

    const loadExpCategories = async () => {
        if (!state.expensesCategories) {
            const { data, error } = await api('api/expense/categories').get().json();
            if (error.value) {
                //error
                //console.log(error.value);
            }
            state.expensesCategories = data.value;
        }
    };

    const loadCurrencies = async () => {
        if (!state.currencies) {
            const { data, error } = await api('api/currencies').get().json(); 
            if (error.value) {
                //error
                //console.log(error.value);
            }
            state.currencies = data.value;
        }
    };

    const loadStateCategories = async () => {
        if (!state.categories) {
            const { data, error } = await api('api/state/categories').get().json();
            if (error.value) {
                //error
            }
            state.stateCategories = data.value;
        }
    };

    const loadCurrentStates = async (dateRange) => {
        //TO DO check if there is data for this range
        const { data, error } = await api('api/dashboard/last_states').post({
            date: dateRange
        }).json();
        if (error.value) {
            console.error(error.value);
            //TO DO
        } else {
            console.log(data.value);
            state.states = data.value;
        }
    };

    return {
        state,
        getCurrentUser,
        loadExpCategories,
        loadCurrencies,
        loadStateCategories,
        loadCurrentStates
    };
});