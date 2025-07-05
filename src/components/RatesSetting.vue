<template>
    <div class="currencies-wrapper q-px-md">
        <div class="currencies-content row q-gutter-sm">
            <q-card bordered v-for="currency in currencies" :key="currency.id" class="rate-card">
                <q-card-section class="rate-card-section">
                    <q-input outlined v-model="currency.title" label="Title" debounce="600"
                        readonly :dense="true" dark bg-color="dark"
                        :rules="[val => /^[a-zA-Z]+$/gm.test(val) || 'Title should be string']"
                        @update:model-value="(value) => handleInput(value, currency, 'title')"
                    />
                    <q-input outlined v-model="currency.str_id" label="String Code" dark bg-color="dark" debounce="600" 
                        :rules="[val => /^[A-Z]+$/.test(val) || 'String code can contain only capital letters']"
                        @update:model-value="(value) => handleInput(value, currency, 'str_id')"
                    />
                    <q-input outlined v-model="currency.rate" label="Rate" dark bg-color="dark" debounce="600"
                        :rules="[val => /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(val) || 'Rate should be a number']"
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

const $q = useQuasar();
const mainStore = useMainStore();
const api = useClient();
const currencies = ref(null);

const handleInput = async (value, currency, field) => {
    if (currency[field].hasError) {
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