<template>
    <LoadingSpinner v-if="loading" class="q-mt-lg"/>
    <div v-else>
        <q-card bordered flat v-for="category in categories" class="category-card">
            <q-card-section>
                <div class="row q-gutter-lg justify-between">
                    <q-input v-model="category.title" label="Title" style="flex: 1;" debounce="600"
                        @update:model-value="handleInput(category.id)"
                    />
                    <div>
                        <DeleteButton @handle-delete="handleDelete(category.id)"/>
                    </div>
                </div>
                <q-input v-model="category.str_id" readonly label="Str_id" debounce="600"
                    :rules="[val => /^[a-zA-Z]+$/gm.test(val) && !categories.some(item => item.str_id === val.trim()) 
                        || 'Str_id should be string and unique']"
                    @update:model-value="handleInput(category.id)"
                />
                <q-input v-model="category.limit" type="number" label="Limit" debounce="600"
                    :rules="[val => /^[1-9]{1,}\d{0,}$/gm.test(val) || 'Limit must be a positive number']"
                    @update:model-value="handleInput(category.id)"
                />
                <q-input v-model="category.desc" label="Description" debounce="600"
                    :rules="[val => /^[a-zA-Zа-яА-ЯёЁ0-9\u0022\u0027,]+$/gm.test(val) || 'Description can contain only text']"
                    @update:model-value="handleInput(category.id)"
                />
                <q-select v-model="category.currency_id" :options="currencies" label="Currency" emit-value map-options
                    @update:model-value="handleInput(category.id)"
                />

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
import DeleteButton from '@/components/buttons/DeleteButton.vue';
import { useQuasar } from 'quasar';

const api = useClient();
const mainStore = useMainStore();
const categories = ref(null);
const loading = ref(true);
const $q = useQuasar();

const currencies = computed(() => {
    return mainStore.state.currencies?.reduce((result, currency) => {
        result.push({
            label: currency.str_id,
            value: currency.id
        });
        return result;
    }, []);
});

const handleInput = (id) => {
    const category = categories.value.find(item => item.id == id);
    console.log(category);
};

const handleDelete = (id) => {
    console.log(id);
    $q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete expenses category? All expenses of this category will be deleted. Maybe you would like to set it unactive instead?',
        cancel: true,
        persistent: true
    }).onOk(async () => {
        const { error } = await api().delete(`api/expenses-category/${id}/delete`).json();
        if (error.value) {
            console.log(error.value)
        } else {
            categories.value = categories.value.reduce(function (acc, item) {
                if (item.id != id) {
                    acc.push(item);
                }
                return acc;
            }, []);
            mainStore.state.expensesCategories = mainStore.state.expensesCategories.reduce(function (acc, item) {
                if (item.id != id) {
                    acc.push(item);
                }
                return acc;
            }, []);
        }
    }).onCancel(() => {
        // console.log('>>>> Cancel')
    });
};

onMounted(async () => {
    loading.value = true;
    mainStore.loadCurrencies();
    const { data, error } = await api('api/expense/categories?all=true').get().json();
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
    margin-right: auto;
    margin-left: auto;
}
</style>