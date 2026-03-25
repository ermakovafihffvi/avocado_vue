<template>
    <div class="currencies-wrapper q-px-md">
        <div class="currencies-content row q-gutter-sm">
            <q-card bordered v-for="currency in currencies" :key="currency.id" class="rate-card">
                <q-card-section class="rate-card-section">
                    <q-input outlined 
                        v-model="currency.title" 
                        label="Title"
                        readonly 
                        :dense="true" 
                        dark 
                        bg-color="dark" 
                        lazy-rules="ondemand"
                        :ref="(el) => setRef(el, currency.id + '-title')"
                        :rules="[val => stringTest(val) || 'Title should be a string']"
                        @update:model-value="(value) => handleInput(value, currency, 'title')"
                    />
                    <q-input outlined 
                        v-model="currency.str_id" 
                        label="String Code" 
                        dark 
                        bg-color="dark" 
                        lazy-rules="ondemand"
                        :ref="(el) => setRef(el, currency.id + '-str_id')"
                        :rules="[val => capitalLetterTest(val) || 'String code can contain only capital letters']"
                        @update:model-value="(value) => handleInput(value, currency, 'str_id')"
                    />
                    <q-input outlined 
                        v-model="currency.rate" 
                        label="Rate" 
                        dark 
                        bg-color="dark" 
                        lazy-rules="ondemand"
                        :ref="(el) => setRef(el, currency.id + '-rate')"
                        :rules="[val => numberTest(val) || 'Rate should be a number']"
                        @update:model-value="(value) => handleInput(value, currency, 'rate')"
                    />
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>
<script setup>
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import validationRules from '@shared/validation/rules.js';

const $q = useQuasar();
const mainStore = useMainStore();
const api = useClient();
const currencies = ref(null);
const inputRefs = ref({});

const { stringTest, capitalLetterTest, numberTest } = validationRules();

const setRef = (el, key) => {
    inputRefs.value[key] = el;
};

const handleInput = async (value, currency, field) => {
    useDebounceFn(async () => {
        const refKey = currency.id + '-' + field;
        const inputComponent = inputRefs.value[refKey];
        if (inputComponent) {
            const validationResult = await inputComponent.validate();
            if (!validationResult) {
                return;
            }
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
            return;
        } else {
            $q.notify({
                type: 'positive',
                message: 'Currency has been successfully set',
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
.currencies-wrapper {
    margin-left: auto;
    margin-right: auto;
}
.currencies-content {
    margin-top: 15px;
}
.rate-card {
    max-width: 300px;
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