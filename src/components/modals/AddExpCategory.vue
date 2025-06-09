<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card bordered>
                <q-card-section>
                    <div class="text-h5 text-primary text-center">Add expenses category</div>   
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <q-input outlined v-model="title" label="Title" 
                        :rules="[val => /^[a-zA-Z]+$/gm.test(val) || 'Title should be string']"
                    />
                    <q-input outlined v-model="strId" label="String Code" class="q-mt-md"
                        :rules="[val => /^[A-Z]+$/.test(val) || 'String code can contain only capital letters']"
                    />
                    <q-input outlined v-model="rate" label="Rate" class="q-mt-md"
                        :rules="[val => /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(val) || 'Rate should be a number']"
                    />
                    <q-input outlined v-model="limit" type="number" label="Limit" debounce="600" class="q-mt-md"
                        :rules="[val => /^[1-9]{1,}\d{0,}$/gm.test(val) || 'Limit must be a positive number']"
                    />
                    <q-input outlined v-model="desc" label="Description" debounce="600" class="q-mt-md"
                        :rules="[val => /^[a-zA-Zа-яА-ЯёЁ0-9\u0022\u0027,]+$/gm.test(val) || 'Description can contain only text']"
                    />

                    <div class="q-mt-md">
                        <q-toggle
                            v-model="isActive"
                            checked-icon="check"
                            color="secondary"
                            unchecked-icon="clear"
                            label="Is Active"
                            :true-value="1"
                            :false-value="0"
                        />
                        <q-toggle
                            v-model="special"
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

            <q-card-actions align="right">
                <q-btn color="primary" label="OK" @click="onOKClick" :disable="isOkDisabled" />
                <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import { computed, onMounted, ref } from 'vue';

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
const desc = ref('');
const isActive = ref(1);
const special = ref(0);
const limit = ref(0);
//end new currency

const isOkDisabled = computed(() => {
    return !title.value || title.value.hasError 
        || !strId.value || strId.value.hasError 
        || !rate.value || rate.value.hasError;
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

onMounted(() => {

});
</script>