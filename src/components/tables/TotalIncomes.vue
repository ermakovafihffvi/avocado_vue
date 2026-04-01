<template>
    <h4 class="text-center q-mb-md text-primary">{{ $t('common.total_income') }}</h4>
    <LoadingSpinner v-if="loading || !mainStore.state.users || !mainStore.state.currencies" :size="'lg'"/>
    <div class="q-pa-md" v-else>
        <div class="row q-col-gutter-xs">
            <div class="col" v-for="user in mainStore.state.users" :key="user.id">
                <q-card dark bordered>
                    <q-card-section>
                        <div class="text-h6">{{ user.name }}</div>
                        
                    </q-card-section>

                    <q-separator dark inset />

                    <q-card-section>
                        <div class="text-subtitle2" v-for="income in incomesByUsers[user.id]">
                            {{ income.total }}
                            <span>{{ mainStore.state.currencies.find(item => item.id == income.currency_id).str_id }}</span>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
            
            <div class="col-12">
                <q-card dark bordered>
                    <q-card-section>
                        <div class="text-h6">{{ $t('common.total') }}: <span>{{ totalIncom }}&nbsp;USD</span></div>
                    </q-card-section>
                    <q-separator dark inset/>
                    <q-card-section>
                        <div class="text-subtitle3">
                            {{ $t('messages.info.calculated_according_to_currencies') }} <a class="link" @click="router.push({name: 'currencies'})">{{ $t('common.currency', 2) }}</a>.
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import LoadingSpinner from '../base/LoadingSpinner.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import useClient from '@/api/useClient';
import { useI18n } from 'vue-i18n';
import { useMainStore } from '@/store/main';
import { useQuasar } from 'quasar';

const api = useClient();
const { t } = useI18n();
const mainStore = useMainStore();
const $q = useQuasar();

const loading = ref(true);
const incomes = ref(null);
const incomesByUsers = computed(() => {
    return mainStore.state.users?.reduce((result, user) => {
        result[user.id] = incomes.value ? incomes.value.filter((item) => item.user_id == user.id) : null;
        return result;
    }, {});
});

const totalIncom = computed(() => {
    if (incomes.value && mainStore.state.currencies) {
        let total = 0;
        incomes.value.forEach((income) => {
            total += income.total / mainStore.state.currencies.find((item) => item.id == income.currency_id)?.rate;
        });
        return Number(total).toFixed(2);
    } 
    return 0;
});

const loadingTotalIncomes = async () => {
    loading.value = true;
    const { data, error } = await api('api/income/total').get().json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
        return;
    } 
    incomes.value = data.value;
    loading.value = false;
};

onMounted(() => {
    loadingTotalIncomes();
});

</script>