<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card bordered>
                <q-card-section>
                    <div class="text-h5 text-primary text-center">Add state category</div>   
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <q-input outlined v-model="title" label="Title" 
                        :rules="[val => /^[a-zA-Z0-9\u0020]+$/gm.test(val) || 'Title should be string']"
                    />
                    <q-input outlined v-model="strId" label="String Code" class="q-mt-md"
                        :rules="[val => (/^[a-z_]+$/.test(val) && !strIds.includes(val)) || 'String code can contain only lowercase letters and be uniques']"
                    />
                    <q-select outlined v-model="currencySelected" :options="currencies" label="Currency" emit-value map-options/>
                    <q-input outlined v-model="desc" label="Description" debounce="600" class="q-mt-md"
                        :rules="[val => /^[a-zA-Zа-яА-ЯёЁ0-9\u0022\u0027\u0020,]+$/gm.test(val) || 'Description can contain only text']"
                    />
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
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import { useDialogPluginComponent } from 'quasar';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({});
const mainStore = useMainStore();
const api = useClient();

defineEmits([
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
]);


const title = ref('');
const strId = ref('');
const currencySelected = ref(null);
const desc = ref('');

const isOkDisabled = computed(() => {
    return !title.value || title.value.hasError 
        || !strId.value || strId.value.hasError 
        || desc.value.hasError;
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
            console.log(error.value);
        } else {
            mainStore.state.stateCategories = data.value;
        }
    }
});
</script>