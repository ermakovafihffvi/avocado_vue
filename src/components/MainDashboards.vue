<template>
    <div class="category-card">
    <div class="flex justify-center q-mb-md q-mt-sm">
        <VueDatePicker 
            v-model="dateRange"
            :month-picker="true"
            :format="'MM/yyyy'"
            :range="{}"
        />
    </div>
    <div class="flex justify-center q-mb-md">
        <q-select outlined bottom-slots 
            v-model="selectedCurrency" 
            :options="currencies" 
            option-label="str_id" label="Currency" bg-color="white" class="full-width"
        >
            <template v-slot:hint>
                Select base currency for displaying totals
            </template>
        </q-select>
    </div>
    <q-tab-panels v-model="mainStore.state.mainDashboardTab" animated class="tab-wrapper" v-if="!loading" style="background-color: transparent;">
        <q-tab-panel name="states">
            <States :dateRange="dateRange" :selectedCurrency="selectedCurrency"/>
        </q-tab-panel>

        <q-tab-panel name="expenses">
            <Expenses :dateRange="dateRange" :selectedCurrency="selectedCurrency"/>
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

const mainStore = useMainStore();

const dateRange = ref([]);
const loading = ref(true);

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
//TO DO 06.07:
//validation centralize (optional)
//requests validation all
//periodic expenses !!!
//add date limit for requests where neccessary
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