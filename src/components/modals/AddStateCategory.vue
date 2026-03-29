<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card bordered>
                <q-card-section>
                    <div class="text-h5 text-primary text-center">{{ $t('headers.add_state_category') }}</div>   
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <q-input outlined v-model="title" 
                        :label="$t('common.title')" 
                        :rules="[val => anyStringTest(val) || $t('validation.string', { field: $t('common.title') }). $t('validation.required')]"
                        ref="titleRef"
                    />
                    <q-input outlined v-model="strId" 
                        :label="$t('common.string_code')" class="q-mt-md"
                        :rules="[val => (codeAnyCaseTest(val) && !strIds.includes(val)) || $t('validation.string_code'). $t('validation.required')]"
                        ref="strIdRef"
                    />
                    <q-select outlined v-model="currencySelected" 
                        :options="currencies" 
                        :label="$t('common.currency')" 
                        emit-value 
                        map-options
                    />
                    <q-input outlined v-model="desc" 
                        :label="$t('common.description')" 
                        class="q-mt-md"
                        :rules="[val => (anyStringTest(val) || !val) || $t('validation.text', { field: $t('common.description') })]"
                        ref="descriptionRef"
                    />
                </q-card-section>
            </q-card>

            <q-card-actions align="right">
                <q-btn color="primary" :label="$t('common.ok')" @click="onOKClick" :disable="isOkDisabled" />
                <q-btn color="primary" :label="$t('common.cancel')" @click="onDialogCancel" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import validationRules from '@shared/validation/rules.js';

const { codeAnyCaseTest, anyStringTest } = validationRules();

const props = defineProps({});
const mainStore = useMainStore();
const api = useClient();
const $q = useQuasar();

defineEmits([
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
]);


const title = ref('');
const strId = ref('');
const currencySelected = ref(null);
const desc = ref('');

//refs
const titleRef = ref(null);
const strIdRef = ref(null);
const descriptionRef = ref(null);
//end refs

const isOkDisabled = computed(() => {
    return !title.value || titleRef.value.hasError  
        || !strId.value || strIdRef.value.hasError 
        || descriptionRef.value.hasError
        || !currencySelected.value;
});

const strIds = computed(() => {
    return mainStore.state.stateCategories?.reduce((acc, item) => {        
        acc.push(item.str_id);
        return acc;
    }, []);
});

const currencies = computed(() => {
    return mainStore.state.currencies?.reduce((result, currency) => {
        result.push({
            label: currency.str_id,
            value: currency.id
        });
        return result;
    }, []);
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
// this is part of our example (so not required)
function onOKClick() {
    // on OK, it is REQUIRED to
    // call onDialogOK (with optional payload)
    onDialogOK({
        title: title.value,
        str_id: strId.value,
        currency: currencySelected.value,
        desc: desc.value
    });
    // or with payload: onDialogOK({ ... })
    // ...and it will also hide the dialog automatically
};

onMounted(async () => {
    if (!mainStore.state.stateCategories) {
        const { data, error } = await api('api/state/categories').get().json();
        if (error.value) {
            $q.notify({
                type: 'error',
                message: error.value,
                color: 'negative'
            });
        } else {
            mainStore.state.stateCategories = data.value;
        }
    }
});
</script>