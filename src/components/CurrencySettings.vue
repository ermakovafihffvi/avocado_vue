<template>
    <div class="currencies-wrapper q-mx-auto q-px-md">
        <div class="currencies-content q-mt-md row q-gutter-sm" v-if="currencies?.length">
            <q-card bordered v-for="currency in currencies" :key="currency.id" class="rate-card">
                <q-card-section class="rate-card-section">
                    <q-input outlined 
                        v-model="currency.title" 
                        :label="$t('common.title')"
                        readonly 
                        :dense="true" 
                        dark 
                        bg-color="dark" 
                        @update:model-value="(value) => handleInput(value, currency, 'title')"
                    />
                    <q-input outlined 
                        v-model="currency.str_id" 
                        :label="$t('common.string_code')" 
                        dark 
                        bg-color="dark" 
                        :ref="(el) => setRef(el, currency.id + '-str_id')"
                        :rules="[val => capitalLetterTest(val) || $t('validation.string_code_capital') + '. ' + $t('validation.required')]"
                        @update:model-value="(value) => handleInput(value, currency, 'str_id')"
                    />
                    <q-input outlined 
                        v-model="currency.rate" 
                        :label="$t('common.rate')" 
                        dark 
                        bg-color="dark" 
                        :ref="(el) => setRef(el, currency.id + '-rate')"
                        :rules="[val => numberTest(val) || $t('validation.number', {field: $t('common.rate')}) + '. ' + $t('validation.required')]"
                        @update:model-value="(value) => handleInput(value, currency, 'rate')"
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="q-mt-xl" v-else>
            <no-data :usePic="true"/>
        </div>
    </div>
</template>
<script setup>
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import validationRules from '@shared/validation/rules.js';
import NoData from '@/components/base/NoData.vue';

const $q = useQuasar();
const { t } = useI18n();
const mainStore = useMainStore();
const api = useClient();
const currencies = ref(null);

const { capitalLetterTest, numberTest } = validationRules();

const inputRefs = ref({});
const setRef = (el, key) => {
    inputRefs.value[key] = el;
};

const handleInput = async (value, currency, field) => {
    useDebounceFn(async () => {
        const refKey = currency.id + '-' + field;
        const inputComponent = inputRefs.value[refKey];
        if (inputComponent && inputComponent.hasError) {
            return;
        }

        const requestCurrency = {
            id: currency.id,
            [field]: value
        };

        const { error } = await api('api/' + requestCurrency.id + '/set-rate').post(requestCurrency).json();
        if (error.value) {
            $q.notify({
                type: 'error',
                message: error.value,
                color: 'negative'
            });
        } else {
            $q.notify({
                type: 'positive',
                message: t('messages.success.currency_set'),
                color: 'positive'
            });
            mainStore.state.currencies.map((item) => {
                if (item.id == requestCurrency.id) {
                    item[field] = value;
                }
            });
        }
    }, 400)();
};

onMounted(async () => {
    if (typeof mainStore.state.currencies === 'undefined' || !mainStore.state.currencies) {
        await mainStore.loadCurrencies();
    }
    currencies.value = mainStore.state.currencies;
});
</script>

<style lang="scss">
.rate-card {
    width: 300px;
    background-color: $secondary;
}
.rate-card-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>

<style lang="sass" scoped>
@media (min-width: $breakpoint-sm-min)
    .currencies-wrapper
        max-width: 980px;  

@media (max-width: $breakpoint-sm-min)
    .rate-card
        width: 90%;
    .currencies-content 
        justify-content: center;
</style>