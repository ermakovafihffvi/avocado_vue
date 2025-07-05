<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">

            <q-card bordered>
                <q-card-section>
                    <div class="text-h5 text-primary text-center">Add expense</div>   
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <q-select outlined v-model="category" :options="expCategories" label="Category" emit-value map-options/>
                    <q-input outlined v-model="description" label="Description" class="q-mt-lg"
                        :rules="[val => /^[a-zA-Zа-яА-ЯёЁ0-9\u0022\u0027\u0020,]+$/gm.test(val) || 'Description can contain only text']"
                    />
                    <q-input outlined v-model="sum" label="Sum" 
                        :rules="[val => /^[1-9]{1,}\d{0,}$/gm.test(val) || 'Sum must be a positive number']"
                    />
                    <q-input outlined v-model="date" mask="date" :rules="['date']">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="date" minimal :options="dateOptions">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <q-select outlined v-model="repeatable" :options="repeatableOptions" emit-value map-options option-value="str" option-label="title"/>
                    <q-input v-if="repeatable == 'x-times'" outlined v-model="repeatTimes" label="Repeat X times" class="q-mt-lg"
                        :rules="[val => /^[1-9]{1,}\d{0,}$/gm.test(val) || 'Sum must be a positive number']"
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
import { getAvailableDates } from '@/composables/getAvailableDates';
import { useMainStore } from '@/store/main';
import { useDialogPluginComponent } from 'quasar';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    id: [Number, String],
    userId: [Number, String],
    categoryId: [Number, String],
    sum: [Number, String],
    description: String,
    date: String
});

defineEmits([
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
]);

const mainStore = useMainStore();

const expCategories = computed(() => {
    return mainStore.state.expensesCategories?.reduce((result, category) => {
        if (!category.special) {
            result.push({
                label: category.title,
                value: category.id
            });
        }
        return result;
    }, []);
});

const category = ref(props.categoryId ?? null);
const description = ref(props.description ?? '');
const sum = ref(props.sum ?? null);
const date = ref(null);

const dateOptions = (date) => {
    const { prevStr, nextStr } = getAvailableDates();
        
    return date <= nextStr && date >= prevStr;
};

const repeatableOptions = ref([
    {
        'str': 'no-repeat',
        'title': 'no repeats'
    },
    {
        'str': 'every-month',
        'title': 'every month'
    },
    {
        'str': 'x-times',
        'title': 'repeat X times'
    }
]);
const repeatable = ref('no-repeats');
const repeatTimes = ref();

const isOkDisabled = computed(() => {
    return !category.value || category.value.hasError 
        || !description.value || description.value.hasError 
        || !sum.value || sum.value.hasError
        || !date.value || date.value.hasError
        || (repeatable.value == 'x-times' && (!repeatTimes.value || repeatTimes.value.hasError));
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
// this is part of our example (so not required)
function onOKClick() {
    // on OK, it is REQUIRED to
    // call onDialogOK (with optional payload)
    onDialogOK({
        id: props.id,
        categoryId: category.value,
        description: description.value,
        sum: sum.value,
        date: date.value,
        user_id: props.userId,
        repeatable: repeatable.value,
        repeatTimes: repeatTimes.value
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