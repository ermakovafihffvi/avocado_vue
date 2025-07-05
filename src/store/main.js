import useClient from '@/api/useClient';
import { getAvailableDates } from '@/composables/getAvailableDates';
import { useDateFormat } from '@vueuse/core';
import { defineStore } from 'pinia'
import { reactive } from 'vue';
import { Notify } from 'quasar';

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
        mainDashboardTab: 'states',
        currentUser: null,
        usersExpenses: {},
        usersIncomes: {},
        savingCategories: null,
        allExpensesCategoriesReloadable: null,
        xDate: 22,
        stateCategories: null,
        states: null,
        lastState: null,
        lastPeriod: useDateFormat(new Date(getAvailableDates().nextStr), 'YYYY-MM', { locale: 'en-US' })
    });

    const api = useClient();

    const getCurrentUser = async () => {
        if (state.currentUser && state.currentUser.id > 0) return state.currentUser;
        const { data, error } = await api('api/current-user').get().json();
        if (error.value) {
            Notify.create({
                type: 'error',
                message: error.value,
                color: 'negative'
            });
            return null;
        }
        state.currentUser = data.value;
        return state.currentUser;
    };

    const loadExpCategories = async () => {
        if (!state.expensesCategories) {
            const { data, error } = await api('api/expense/categories').get().json();
            if (error.value) {
                Notify.create({
                    type: 'error',
                    message: error.value,
                    color: 'negative'
                });
                return null;
            }
            state.expensesCategories = data.value;
        }
    };

    const loadCurrencies = async () => {
        if (!state.currencies) {
            const { data, error } = await api('api/currencies').get().json(); 
            if (error.value) {
                Notify.create({
                    type: 'error',
                    message: error.value,
                    color: 'negative'
                });
                return null;
            }
            state.currencies = data.value;
        }
    };

    const loadStateCategories = async () => {
        if (!state.categories) {
            const { data, error } = await api('api/state/categories').get().json();
            if (error.value) {
                Notify.create({
                    type: 'error',
                    message: error.value,
                    color: 'negative'
                });
                return null;
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
            Notify.create({
                type: 'error',
                message: error.value,
                color: 'negative'
            });
        } else {
            state.states = data.value;
            const isCurrentIncluded = (new Date(dateRange[1].year + '-' + (dateRange[1].month + 1))).setHours(20) >= (new Date(state.lastPeriod)).setHours(20);
            if (isCurrentIncluded) {
                state.lastState = state.states?.filter(el => 
                        el.pseudo_month == state.lastPeriod
                    )?.reduce((acc, el) => {
                        const rate = state.currencies?.find(el => el.id == el.currency_id)?.rate ?? 1;
                        acc += Number(el.sum) / rate;
                        return acc;
                    }, 0);
            }
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