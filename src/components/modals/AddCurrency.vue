<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card bordered>
                <q-card-section>
                    <div class="text-h5 text-primary text-center">{{ $t('headers.add_currency') }}</div>   
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <q-input outlined v-model="title" 
                        :label="$t('common.title')" 
                        :rules="[val => stringTest(val) || $t('validation.string', { field: $t('common.title') }) + '. ' + $t('validation.required')]"
                        ref="titleRef"
                    />
                    <q-input outlined v-model="strId" 
                        :label="$t('common.string_code')" 
                        class="q-mt-md"
                        :rules="[val => capitalLetterTest(val) || $t('validation.string_code_capital') + '. ' + $t('validation.required')]"
                        ref="strIdRef"
                    />
                    <q-input outlined v-model="rate" 
                        :label="$t('common.rate')" 
                        class="q-mt-md"
                        :rules="[val => numberTest(val) || $t('validation.number', {field: $t('common.rate')}) + '. ' + $t('validation.required')]"
                        ref="rateRef"
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
import { useDialogPluginComponent } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import validationRules from '@shared/validation/rules.js';

const props = defineProps({});

defineEmits([
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
]);

//new currency
const title = ref('');
const strId = ref('');
const rate = ref('');
//end new currency

//refs
const titleRef = ref(null);
const strIdRef = ref(null);
const rateRef = ref(null);
//end refs

const isOkDisabled = computed(() => {
    return !title.value || titleRef.value?.hasError
        || !strId.value || strIdRef.value?.hasError 
        || !rate.value || rateRef.value?.hasError;
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
// this is part of our example (so not required)
function onOKClick() {
    // on OK, it is REQUIRED to
    // call onDialogOK (with optional payload)
    onDialogOK({
        title: title.value,
        str_id: strId.value,
        rate: rate.value,
    });
    // or with payload: onDialogOK({ ... })
    // ...and it will also hide the dialog automatically
};

const { stringTest, capitalLetterTest, numberTest } = validationRules();

onMounted(() => {

});
</script>