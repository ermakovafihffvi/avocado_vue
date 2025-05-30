<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">

            <q-card bordered>
                <q-card-section>
                    <div class="text-h5 text-primary text-center">Add income</div>   
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <q-input outlined v-model="description" label="Description" class="q-mt-lg"
                        :rules="[val => /^[a-zA-Zа-яА-ЯёЁ0-9\u0022\u0027,]+$/gm.test(val) || 'Description can contain only text']"
                    />
                    <q-input outlined v-model="sum" label="Sum" 
                        :rules="[val => /^[1-9]{1,}\d{0,}$/gm.test(val) || 'Sum must be a positive number']"
                    />
                    <q-select outlined v-model="currencySelected" :options="currencies" label="Currency" emit-value map-options/>
                    <q-input outlined v-model="date" mask="date" :rules="['date']" class="q-mt-lg">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="date" minimal>
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </q-card-section>
            </q-card>

            <q-card-actions align="right">
                <q-btn color="primary" label="OK" @click="onOKClick" />
                <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { useMainStore } from '@/store/main';
import { useDialogPluginComponent } from 'quasar';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    id: [Number, String],
    userId: [Number, String],
    sum: [Number, String],
    description: String,
    date: String,
    currency: [String, Number]
});

defineEmits([
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
]);

const mainStore = useMainStore();

const description = ref(props.description ?? '');
const sum = ref(props.sum ?? null);
const date = ref(null);

const currencies = computed(() => {
    return mainStore.state.currencies?.reduce((result, currency) => {
        result.push({
            label: currency.str_id,
            value: currency.id
        });
        return result;
    }, []);
});

const currencySelected = ref(props.currency ?? null);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
// this is part of our example (so not required)
function onOKClick() {
    // on OK, it is REQUIRED to
    // call onDialogOK (with optional payload)
    onDialogOK({
        id: props.id,
        description: description.value,
        sum: sum.value,
        date: date.value,
        user_id: props.userId,
        currency: currencySelected.value
    });
    // or with payload: onDialogOK({ ... })
    // ...and it will also hide the dialog automatically
};

onMounted(() => {
    mainStore.loadExpCategories();
    
    const created_date = props.date ? new Date(props.date) : new Date();
    date.value = created_date.getFullYear() + "/" 
        + ('0' + Number(created_date.getMonth() + 1)).slice(-2) + "/" 
        + created_date.getDate();
});
</script>