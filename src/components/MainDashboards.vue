<template>
    <div class="category-card">
    <div class="flex justify-center q-mb-md q-mt-sm q-mx-md">
        <VueDatePicker 
            v-model="dateRange"
            :month-picker="true"
            :format="'MM/yyyy'"
            :range="{}"
        />
    </div>
    <div class="flex justify-center q-mb-md q-mx-md">
        <q-select outlined bottom-slots 
            v-model="selectedCurrency" 
            :options="currencies" 
            option-label="str_id" :label="$t('common.currency')" class="full-width select-currency"
        >
            <template v-slot:hint>
                {{ $t('messages.info.base_currency_hint') }}
            </template>
        </q-select>
    </div>
    <q-tab-panels v-model="mainStore.state.mainDashboardTab" animated class="tab-wrapper" v-if="!loading" style="background-color: transparent;">
        <q-tab-panel name="states">
            <States :dateRange="dateRange" :selectedCurrency="selectedCurrency"/>
        </q-tab-panel>

        <q-tab-panel name="expenses">
            <Expenses :dateRange="dateRange" :selectedCurrency="selectedCurrency"/>
            <q-btn v-if="!loadDetails" @click="loadDetails = true" color="secondary" class="q-mt-md">
                {{ $t('common.load_expenses_details') }}
            </q-btn>
            <DetailedExpenses v-else :dateRange="dateRange" class="q-mt-md"/>
        </q-tab-panel>

        <q-tab-panel name="incomes">
            <Incomes :dateRange="dateRange" :selectedCurrency="selectedCurrency"/>
        </q-tab-panel>
    </q-tab-panels>
    </div>
</template>

<script setup>
import { useMainStore } from '@/store/main';
import States from './dashboards/States.vue';
import Expenses from './dashboards/Expenses.vue';
import Incomes from './dashboards/Incomes.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { onMounted, ref } from 'vue';
import { getDateRange } from '@/composables/getAvailableDates';
import { computed } from 'vue';
import DetailedExpenses from '@/components/dashboards/DetailedExpenses.vue';

const mainStore = useMainStore();

const dateRange = ref([]);
const loading = ref(true);
const loadDetails = ref(false);

const selectedCurrency = ref();
const currencies = computed(() => mainStore.state.currencies);

onMounted(async () => {
    dateRange.value = getDateRange(5);
    await mainStore.loadCurrencies();
    selectedCurrency.value = mainStore.state.currencies.find(el => el.str_id == 'ILS');
    loading.value = false;
});
</script>

<style lang="scss" scoped>
//TO DO 19.07:
//validation centralize (optional)
//requests validation all
//add date limit for requests where neccessary
//единая заглушка дл яотсутсвующих данных

.category-card {
    margin-bottom: 20px;
    margin-right: auto;
    margin-left: auto;
}
</style>

<style lang="sass" scoped>
@media (min-width: 641px) 
    .category-card
        width: 600px; 
@media (min-width: 850px) 
    .category-card
        width: 800px; 
</style>
