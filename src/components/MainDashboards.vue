<template>
    <LoadingSpinner v-if="loading" class="q-mt-lg"/>
    <div class="category-card q-mx-auto" v-if="!loading && currencies?.length">
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
                option-label="str_id" 
                :label="$t('common.currency')" 
                class="full-width select-currency"
            >
                <template v-slot:hint>
                    {{ $t('messages.info.base_currency_hint') }}
                </template>
            </q-select>
        </div>
        <q-tab-panels v-model="mainStore.state.mainDashboardTab" 
            animated 
            class="tab-wrapper"  
            style="background-color: transparent;"
        >
            <q-tab-panel name="states">
                <States :dateRange="dateRange" :selectedCurrency="selectedCurrency"/>
            </q-tab-panel>

            <q-tab-panel name="expenses" v-if="mainStore.state.expensesCategories?.length">
                <ExpensesChart :dateRange="dateRange" :selectedCurrency="selectedCurrency"/>
                <q-btn v-if="!loadDetails" @click="loadDetails = true" color="secondary" class="q-mt-md">
                    {{ $t('common.load_expenses_details') }}
                </q-btn>
                <DetailedExpenses v-else :dateRange="dateRange" class="q-mt-md"/>
            </q-tab-panel>
            <q-tab-panel name="expenses" v-else>
                <q-card bordered class="q-mb-md">
                    <q-card-section>
                        <div class="text-subtitle2">
                            {{ $t('messages.info.add_exp_categories_first_1')}}<a class="link" @click="router.push({name: 'category_exp'})">{{$t('common.expenses_category', 2)}}</a>{{ $t('messages.info.add_exp_categories_first_2') }}
                        </div>
                    </q-card-section>
                </q-card>
                <no-data :usePic="true"/>
            </q-tab-panel>

            <q-tab-panel name="incomes">
                <IncomesChart :dateRange="dateRange" :selectedCurrency="selectedCurrency"/>
            </q-tab-panel>
        </q-tab-panels>
    </div>

    <div class="q-mt-xl" v-if="!loading && !currencies?.length">
        <q-card bordered class="q-mx-md q-mb-md info-card">
            <q-card-section>
                <div class="text-subtitle2">
                    {{ $t('messages.info.add_currencies_first_1')}}<a class="link" @click="router.push({name: 'currencies'})">{{$t('common.currency', 2)}}</a>{{ $t('messages.info.add_currencies_first_2') }}
                </div>
            </q-card-section>
        </q-card>
        <no-data :usePic="true"/>
    </div>
</template>

<script setup>
import { useMainStore } from '@/store/main';
import States from '@/components/dashboards/States.vue';
import ExpensesChart from '@/components/dashboards/ExpensesChart.vue';
import IncomesChart from '@/components/dashboards/IncomesChart.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { onMounted, ref } from 'vue';
import { getDateRange } from '@/composables/getAvailableDates';
import { computed } from 'vue';
import DetailedExpenses from '@/components/dashboards/DetailedExpenses.vue';
import NoData from '@/components/base/NoData.vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import router from '@/router';

const mainStore = useMainStore();

const dateRange = ref([]);
const loading = ref(true);
const loadDetails = ref(false);

const selectedCurrency = ref();
const currencies = computed(() => mainStore.state.currencies);

const preloadData = async () => {
    return Promise.all([
        await mainStore.loadCurrencies(),
        await mainStore.loadExpCategories()
    ]);
};

onMounted(async () => {
    dateRange.value = getDateRange(5);
    await preloadData();
    selectedCurrency.value = mainStore.state.currencies?.find(el => el.str_id == 'ILS') ?? mainStore.state.currencies?.[0];
    loading.value = false;
});
</script>

<style lang="scss" scoped>
.category-card {
    margin-bottom: 20px;
}
</style>

<style lang="sass" scoped>
@media (min-width: 641px) 
    .category-card
        width: 600px; 
    .info-card
        width: 600px;
        margin-left: auto !important;
        margin-right: auto !important;
@media (min-width: 850px) 
    .category-card
        width: 800px; 
</style>
