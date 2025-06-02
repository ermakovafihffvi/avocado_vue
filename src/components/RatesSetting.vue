<template>
    <div class="currencies-wrapper q-px-md">
        <div class="currencies-content row q-gutter-sm">
            <q-card bordered v-for="currency in mainStore.state.currencies" :key="currency.id" class="rate-card">
                <q-card-section class="rate-card-section">
                    <q-input outlined v-model="currency.title" label="Title" debounce="600"
                        readonly :dense="true" dark bg-color="dark"
                        @update:model-value="(value) => handleInput(value, currency)"
                    />
                    <q-input outlined v-model="currency.str_id" label="String Code" dark bg-color="dark" debounce="600" 
                        @update:model-value="(value) => handleInput(value, currency)"
                    />
                    <q-input outlined v-model="currency.rate" label="Rate" dark bg-color="dark" debounce="600"
                        @update:model-value="(value) => handleInput(value, currency)"
                    />
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>
<script setup>
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import { onMounted } from 'vue';

const mainStore = useMainStore();
const api = useClient();

const handleInput = async (value, currency) => {
    console.log(value, currency);
    const { error } = await api('api/' + currency.id + '/set-rate').post(currency).json();
    if (error.value) {
        console.log(error);
        return;
    }
};

onMounted(() => {
    if (typeof mainStore.state.currencies === 'undefined' || !mainStore.state.currencies) {
        mainStore.loadCurrencies();
    }
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
    background-color: $secondary-light;
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