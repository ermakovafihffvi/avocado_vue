<template>
    <LoadingSpinner v-if="loading" class="q-mt-lg"/>
    <div v-else>
        <q-card bordered flat v-for="category in categories" class="category-card">
            <q-card-section>
                <div class="row q-gutter-lg justify-between">
                    <q-input v-model="category.title" label="Title" style="flex: 1;" debounce="600"

                    />
                    <div>
                        <q-btn flat round color="negative" icon="sym_o_delete" size="md"/>
                    </div>
                </div>
                <q-input v-model="category.str_id" readonly label="Str_id" debounce="600"
                    :rules="[val => /^[a-zA-Z]+$/gm.test(val) || 'Str_id should be string']"
                />
                <q-input v-model="category.limit" type="number" label="Limit" debounce="600"
                    :rules="[val => /^[1-9]{1,}\d{0,}$/gm.test(val) || 'Limit must be a positive number']"
                />
                <q-input v-model="category.desc" label="Description" debounce="600"
                    :rules="[val => /^[a-zA-Zа-яА-ЯёЁ0-9\u0022\u0027,]+$/gm.test(val) || 'Description can contain only text']"
                />
                <q-select v-model="category.currency_id" :options="currencies" label="Currency" emit-value map-options/>

                <div>
                    <q-toggle
                        v-model="category.isActive"
                        checked-icon="check"
                        color="secondary"
                        unchecked-icon="clear"
                        label="Is Active"
                        :true-value="1"
                        :false-value="0"
                    />
                    <q-toggle
                        v-model="category.special"
                        checked-icon="check"
                        color="accent"
                        label="Is special"
                        unchecked-icon="clear"
                        :true-value="1"
                        :false-value="0"
                    />
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import { computed, onMounted, ref } from 'vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';

const api = useClient();
const mainStore = useMainStore();
const categories = ref(null);
const loading = ref(true);

const currencies = computed(() => {
    return mainStore.state.currencies?.reduce((result, currency) => {
        result.push({
            label: currency.str_id,
            value: currency.id
        });
        return result;
    }, []);
});

const handleInput = () => {

};

onMounted(async () => {
    loading.value = true;
    mainStore.loadCurrencies();
    const { data, error } = await api('api/expenses-categories?all=true').get().json();
    if (error.value) {
        console.log(error.value);
    } else {
        categories.value = data.value;
    }
    loading.value = false;
});
</script>

<style lang="scss" scoped>
.category-card {
    margin-bottom: 20px;
    width: 600px;
}
</style>