<template>
    <q-card>
        <q-card-section>
            <h5>Period: <span class="text-primary">{{ fixingPeriod.prevStr + ' - ' + fixingPeriod.nextStr }}</span></h5>
        </q-card-section>
        <q-card-section v-if="!stateId">
            <q-chip color="positive" icon="done_all" v-if="allFixed">
                All categories filled
            </q-chip>
            <q-chip color="negative" icon="report_problem" v-else>
                Not all categories filled
            </q-chip>
        </q-card-section>
        <q-card-section>
            <q-select outlined v-model="selectedUser" :options="users" option-value="id" option-label="name" label="User" />
            <q-select class="q-mt-lg" outlined v-model="selectedStateCategory" :options="stateCategories" option-value="id" option-label="title" label="State category" />
            <q-select class="q-mt-lg disabled" outlined readonly v-model="selectedCurrency" :options="currencies" option-value="id" option-label="str_id" label="Currency" />
            <q-input class="q-mt-lg" outlined v-model="sum" label="Sum" 
                :rules="[val => /^[1-9].{1,}\d{0,}$/gm.test(val) || 'Sum must be a positive number']"
            />
            <q-btn push color="primary" label="Fix" :disable="fixDisabled" @click="handleFix"/>
        </q-card-section>
    </q-card>
</template>

<script setup>
import useClient from '@/api/useClient';
import { getAvailableDates, getDateRange } from '@/composables/getAvailableDates';
import useAllFixed from '@/composables/useAllFixed';
import { useMainStore } from '@/store/main';
import { useQuasar } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const mainStore = useMainStore();
const $q = useQuasar();
const api =useClient();
const route = useRoute();
const allFixer = useAllFixed();

const stateId = computed(() => route.params.id);
const state = computed(() => mainStore.state.states?.find(el => el.id == stateId.value));

const selectedUser = ref();
const selectedStateCategory = ref();
const selectedCurrency = ref();
const sum = ref();

const currencies = computed(() => mainStore.state.currencies ?? []);
const stateCategories = computed(() => mainStore.state.stateCategories ?? []);
const users = computed(() => mainStore.state.users ?? []);
const pseudoMonth = ref('');
const dateRange = ref();

const fixingPeriod = computed(() => {
    if (state.value) return getAvailableDates(new Date(state.value.pseudo_month));
    if (route.params.pseudo_month) return getAvailableDates(new Date(route.params.pseudo_month));
    return getAvailableDates();
});

const allFixed = computed(() => {
    return allFixer.isAllFixed(pseudoMonth.value);
});

const hasPrevSumValue = ref(false);
const findAndSetSum = () => {
    let isprev = false;
    if (selectedStateCategory.value && selectedUser.value) {
        sum.value = mainStore.state.states?.find(el => {
            return el.category_id == selectedStateCategory.value.id && el.user_id == selectedUser.value.id && el.pseudo_month == pseudoMonth.value;
        })?.sum;
        if (sum.value) {
            isprev = true;
        }
    }
    hasPrevSumValue.value = isprev;
};

const fixDisabled = computed(() => {
    return !selectedStateCategory.value || !selectedUser.value || !sum.value || sum.value.error;
});
const handleFix = () => {
    let message = 'Are you sure you want to add data? It is recommended to fix data once a month.';
    if (hasPrevSumValue.value) {
        message += ' You have already added sum for this user, period and category.'
    }
    $q.dialog({
        title: 'Confirm',
        message: message,
        cancel: true,
        persistent: true
    }).onOk(async () => {
        const dataRes = {
            'category_id': selectedStateCategory.value.id,
            'user_id': selectedUser.value.id,
            'sum': sum.value,
            'pseudo_month': pseudoMonth.value
        };
        const { data, error } = await api(`api/state/update`).post(dataRes).json();
        if (error.value) {
            $q.notify({
                type: 'error',
                message: error.value,
                color: 'negative'
            });
        } else {
            $q.notify({
                type: 'positive',
                message: 'State has been successfully updated',
                color: 'positive'
            });
            if (hasPrevSumValue.value) {
                mainStore.state.states.forEach(el => {
                    if (el.user_id == dataRes.user_id && el.category_id == dataRes.category_id && el.pseudo_month == pseudoMonth.value) {
                        el.sum = dataRes.sum;
                    }
                });
            } else {
                mainStore.state.states.push(data.value);
            }
            hasPrevSumValue.value = true;
        }
    }).onCancel(() => {
        // console.log('>>>> Cancel')
    });
};

const setDataForState = () => {
    if (state.value) {
        pseudoMonth.value = state.value.pseudo_month;
        const category = mainStore.state.stateCategories?.find(el => el.id == state.value.category_id);
        selectedUser.value = mainStore.state.users?.find(user => user.id == state.value.user_id);
        selectedStateCategory.value = category;
        selectedCurrency.value = category ? mainStore.state.currencies?.find(el => el.id == category.currency_id) : '';
    } else {
        if (route.params.user_id) {
            selectedUser.value = mainStore.state.users?.find(user => user.id == route.params.user_id);
        }
        if (route.params.category_id) {
            const category = mainStore.state.stateCategories?.find(el => el.id == route.params.category_id);
            selectedStateCategory.value = category;
            selectedCurrency.value = category ? mainStore.state.currencies?.find(el => el.id == category.currency_id) : '';
        }
    }
};

onMounted(async () => {
    await mainStore.loadCurrencies();
    await mainStore.loadStateCategories();
    
    if (route.params.pseudo_month) {
        dateRange.value = getDateRange(1, route.params.pseudo_month);
        pseudoMonth.value = dateRange.value[1].year + "-" + String(Number(dateRange.value[1].month + 1)).padStart(2, '0');
    } else {
        dateRange.value = getDateRange(1);
        pseudoMonth.value = dateRange.value[1].year + "-" + String(Number(dateRange.value[1].month + 1)).padStart(2, '0');
    }

    await mainStore.loadCurrentStates(dateRange.value);
    setDataForState();
});

watch(selectedStateCategory,
    () => {
        selectedCurrency.value = currencies.value.find(el => el.id == selectedStateCategory.value.currency_id);
        findAndSetSum();
    }
);

watch(selectedUser,
    () => {
        findAndSetSum();
    }
);

watch(stateId, 
    () => {
        setDataForState();
    }
);
</script>