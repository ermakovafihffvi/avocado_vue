<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">

            <q-card bordered>
                <q-card-section>
                    <div class="text-h5 text-primary text-center">{{ $t('headers.add_expense') }}</div>   
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <q-select outlined v-model="category" 
                        :options="expCategories" 
                        :label="$t('common.category')" 
                        emit-value 
                        map-options
                        :rules="[val => val || $t('validation.required')]"
                    />
                    <q-input outlined v-model="description" 
                        :label="$t('common.description')" 
                        class="q-mt-md"
                        :rules="[val => anyStringTest(val) || $t('validation.text', { field: $t('common.description') }) + '. ' + $t('validation.required')]"
                        ref="descriptionRef"
                    />
                    <q-input outlined v-model="sum" 
                        :label="$t('common.sum')" 
                        class="q-mt-md"
                        :rules="[val => positiveNumberTest(val) || $t('validation.positive_number', { field: $t('common.sum') }) + '. ' + $t('validation.required')]"
                        ref="sumRef"
                    />
                    <q-input outlined v-model="date" mask="date" :rules="['date']" class="q-mt-md">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="date" minimal :options="dateOptions">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <q-select outlined v-model="repeatable" 
                        :options="repeatableOptions" 
                        emit-value 
                        map-options 
                        option-value="str" 
                        option-label="title"
                    />
                    <q-input v-if="repeatable == 'x-times'" outlined v-model="repeatTimes" 
                        :label="$t('common.how_many_months')" 
                        class="q-mt-lg"
                        :rules="[val => positiveNumberTest(val) || $t('validation.positive_number', { field: '' })]"
                        ref="repeatTimesRef"
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
import { getAvailableDates } from '@/composables/getAvailableDates';
import { useMainStore } from '@/store/main';
import { useDialogPluginComponent } from 'quasar';
import { useI18n } from 'vue-i18n';
import { computed, onMounted, ref } from 'vue';
import validationRules from '@shared/validation/rules.js';

const { t } = useI18n();
const { positiveNumberTest, anyStringTest } = validationRules();

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

//refs
const sumRef = ref(null);
const descriptionRef = ref(null);
const repeatTimesRef = ref(null);
//end refs

const dateOptions = (date) => {
    const { prevStr, nextStr } = getAvailableDates(); 
    return date <= nextStr && date >= prevStr;
};

const repeatableOptions = ref([
    {
        'str': 'no-repeat',
        'title': t('common.no_repeats')
    },
    {
        'str': 'every-month',
        'title': t('common.every_month')
    },
    {
        'str': 'x-times',
        'title': t('common.repeat_x_times')
    }
]);
const repeatable = ref('no-repeats');
const repeatTimes = ref();

const isOkDisabled = computed(() => {
    return !category.value
        || !description.value || descriptionRef.value.hasError 
        || !sum.value || sumRef.value.hasError
        || !date.value
        || (repeatable.value == 'x-times' && (!repeatTimes.value || repeatTimesRef.value.hasError));
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