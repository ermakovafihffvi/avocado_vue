<template>
    <LoadingSpinner v-if="loading" class="q-mt-lg"/>
    <div v-else>
        <q-card bordered flat v-for="category in categories" class="category-card" :key="category.id" :data-attr-key="category.id">
            <q-card-section>
                <div class="row q-gutter-lg justify-between">
                    <q-input v-model="category.title" :label="$t('common.title')" style="flex: 1;"
                        @update:model-value="handleInput(category.id, 'title')"
                        :rules="[val => anyStringTest(val) || $t('validation.string', { field: $t('common.title') }) + '. ' + $t('validation.required')]"
                        :ref="(el) => setRef(el, category.id + '-title')"
                    />
                    <div>
                        <DeleteButton @handle-delete="handleDelete(category.id)"/>
                    </div>
                </div>
                <q-input v-model="category.str_id" readonly :label="$t('common.string_code')"/>
                <q-input v-model="category.limit" type="number" :label="$t('common.limit')"
                    :rules="[val => positiveNumberTest(val) || $t('validation.positive_number', { field: $t('common.limit') })]"
                    :ref="(el) => setRef(el, category.id + '-limit')"
                    @update:model-value="handleInput(category.id, 'limit')"
                />
                <q-input v-model="category.desc" :label="$t('common.description')"
                    :rules="[val => (anyStringTest(val) || !val) || $t('validation.text', { field: $t('common.description') })]"
                    :ref="(el) => setRef(el, category.id + '-desc')"
                    @update:model-value="handleInput(category.id, 'desc')"
                />
                <q-select v-model="category.currency_id" :options="currencies" :label="$t('common.currency')" emit-value map-options
                    @update:model-value="handleInput(category.id, 'currency_id')"
                />

                <div>
                    <q-toggle
                        v-model="category.isActive"
                        checked-icon="check"
                        color="secondary"
                        unchecked-icon="clear"
                        :label="$t('common.is_active')"
                        @update:model-value="handleInput(category.id, 'isActive')"
                    />
                    <q-toggle
                        v-model="category.special"
                        checked-icon="check"
                        color="accent"
                        :label="$t('common.is_special')"
                        unchecked-icon="clear"
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
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import DeleteButton from '@/components/buttons/DeleteButton.vue';
import { useQuasar } from 'quasar';
import validationRules from '@shared/validation/rules.js';
import { useDebounceFn } from '@vueuse/core';

const api = useClient();
const mainStore = useMainStore();
const { t } = useI18n();
const categories = ref(null);
const loading = ref(true);
const $q = useQuasar();

const { positiveNumberTest, anyStringTest } = validationRules();

const inputRefs = ref({});
const setRef = (el, key) => {
    inputRefs.value[key] = el;
};

const currencies = computed(() => {
    return mainStore.state.currencies?.reduce((result, currency) => {
        result.push({
            label: currency.str_id,
            value: currency.id
        });
        return result;
    }, []);
});

const handleInput = async (id, field) => {
    useDebounceFn(async () => {
        const refField = inputRefs.value[id + '-' + field];
        if (refField && refField.hasError) {
            return;
        }

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
                message: t('messages.success.expenses_category_updated'),
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
    }, 400)();
};

const handleDelete = (id) => {
    $q.dialog({
        title: t('common.confirm'),
        message: t('messages.confirm.delete_expense_category'),
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
                message: t('messages.success.expenses_category_deleted'),
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