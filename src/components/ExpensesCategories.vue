<template>
    <LoadingSpinner v-if="loading" class="q-mt-lg"/>
    <div v-else>
        <q-card bordered flat v-for="category in categories" class="category-card" :key="category.id" :data-attr-key="category.id">
            <q-card-section>
                <div class="row q-gutter-lg justify-between">
                    <q-input v-model="category.title" label="Title" style="flex: 1;" debounce="600"
                        @update:model-value="handleInput(category.id, 'title')"
                    />
                    <div>
                        <DeleteButton @handle-delete="handleDelete(category.id)"/>
                    </div>
                </div>
                <q-input v-model="category.str_id" readonly label="Str_id" debounce="600"
                    :rules="[val => /^[a-zA-Z_]+$/gm.test(val) && !strIds.includes(val.trim()) 
                        || 'Str_id should be string and unique']"
                    @update:model-value="handleInput(category.id, 'str_id')"
                />
                <q-input v-model="category.limit" type="number" label="Limit" debounce="600"
                    :rules="[val => /^[0-9]+$/gm.test(val) || 'Limit must be a positive number']"
                    @update:model-value="handleInput(category.id, 'limit')"
                />
                <q-input v-model="category.desc" label="Description" debounce="600"
                    :rules="[val => (/^[a-zA-Zа-яА-ЯёЁ0-9\u0022\u0027, ]+$/gm.test(val) || !val) || 'Description can contain only text']"
                    @update:model-value="handleInput(category.id, 'desc')"
                />
                <q-select v-model="category.currency_id" :options="currencies" label="Currency" emit-value map-options
                    @update:model-value="handleInput(category.id, 'currency_id')"
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
                        @update:model-value="handleInput(category.id, 'isActive')"
                    />
                    <q-toggle
                        v-model="category.special"
                        checked-icon="check"
                        color="accent"
                        label="Is special"
                        unchecked-icon="clear"
                        :true-value="1"
                        :false-value="0"
                        @update:model-value="handleInput(category.id, 'special')"
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

const strIds = computed(() => {
    return mainStore.state.allExpensesCategoriesReloadable?.reduce((acc, item) => {        
        acc.push(item.str_id);
        return acc;
    }, []);
});

const handleInput = async (id, field) => {
    const category = categories.value.find(item => item.id == id);
    const { error } = await api(`api/expenses-category/${id}/update`).put({
        field: field,
        value: category[field]
    }).json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
    } else {
        $q.notify({
            type: 'positive',
            message: 'Expenses category has been successfully updated',
            color: 'positive'
        });
        mainStore.state.expensesCategories.forEach(item => {
            if (item.id == id) {
                item[field] = category[field];
            }
        });
        mainStore.state.allExpensesCategoriesReloadable.forEach(item => {
            if (item.id == id) {
                item[field] = category[field];
            }
        });
    }
};

const handleDelete = (id) => {
    $q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete expenses category? All expenses of this category will be deleted. Maybe you would like to set it unactive instead?',
        cancel: true,
        persistent: true
    }).onOk(async () => {
        const { error } = await api(`api/expenses-category/${id}/delete`).delete().json();
        if (error.value) {
            $q.notify({
                type: 'error',
                message: error.value,
                color: 'negative'
            });
        } else {
            $q.notify({
                type: 'positive',
                message: 'Expenses category has been successfully updated',
                color: 'positive'
            });
            categories.value = categories.value.reduce(function (acc, item) {
                if (item.id != id) {
                    acc.push(item);
                }
                return acc;
            }, []);
            mainStore.state.expensesCategories = mainStore.state.expensesCategories?.reduce(function (acc, item) {
                if (item.id != id) {
                    acc.push(item);
                }
                return acc;
            }, []);
            mainStore.state.allExpensesCategoriesReloadable = mainStore.state.allExpensesCategoriesReloadable.reduce(function (acc, item) {
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
    let loadedCategories = mainStore.state.allExpensesCategoriesReloadable;
    if (!loadedCategories) {
        const { data, error } = await api('api/expense/categories?all=true').get().json();
        if (error.value) {
            $q.notify({
                type: 'error',
                message: error.value,
                color: 'negative'
            });
        } else {
            loadedCategories = data.value;
        }
    } 
    if (loadedCategories) {
        categories.value = loadedCategories;
        mainStore.state.allExpensesCategoriesReloadable = loadedCategories;
    }
    loading.value = false;
});
</script>

<style lang="scss" scoped>
.category-card {
    margin-bottom: 20px;
    margin-right: auto;
    margin-left: auto;
    padding: 3rem;
}
</style>

<style lang="sass" scoped>
@media (min-width: 641px) 
    .category-card
        width: 600px; 
</style>