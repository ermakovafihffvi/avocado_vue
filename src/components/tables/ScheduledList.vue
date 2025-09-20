<template>
    <div class="card-title-wrapper q-pa-md">
        <div class="text-title-wrapper">
            <h6 class="text-h6 text-primary">{{ userNameTitle ? userNameTitle + ' Scheduled Expenses' : '' }}</h6>
        </div>
    </div>
    <LoadingSpinner v-if="loading" :size="'lg'" />
    <div v-else-if="scheduledExpenses.length">
        <div v-for="expense in scheduledExpenses" :key="expense.id" class="q-py-xs">
            <q-expansion-item class="item-wrapper" switch-toggle-side expand-separator>
                <template v-slot:header>
                    <q-item-section>
                        <span class="text-weight-medium text-body1">{{ expense.expense.desc }}</span>
                        <span class="text-weight-thin text-caption">{{ expense.expense.category.title }}</span>
                    </q-item-section>
                    
                    <q-item-section class="flex flex-center">
                        <span class="text-weight-bold text-h6" 
                            :class="((everyMonthStates[expense.id] || expense.times) && !expense.deleted_at) ? 'text-info' : 'text-blue-grey-3'"
                        >
                            {{ expense.expense.sum }}&nbsp;{{ expense.expense.category.currency.str_id }}
                        </span>
                    </q-item-section>

                    <q-item-section class="flex flex-center" style="max-width: 94px;">
                        <q-badge color="secondary" v-if="expense.is_every_month">
                            <q-icon name="sym_o_autorenew" /> monthly
                        </q-badge>
                        <div v-else class="times-wrapper">
                            <q-btn v-show="editMode[expense.id]" flat round color="secondary" icon="sym_o_remove" size="md" 
                                @click.stop="expense.times > 1 && expense.times > monthsSinceCustomStart(expense.created_at, mainStore.state.xDate) ? expense.times-- : expense.times"
                            />
                            <span class="text-body1" style="vertical-align: middle;">{{ expense.times }}</span>
                            <q-btn v-show="editMode[expense.id]" flat round color="secondary" icon="sym_o_add" size="md" @click.stop="expense.times++"/>
                        </div>
                    </q-item-section>

                    <q-item-section class="flex flex-center" side>
                        <q-toggle
                            v-if="expense.is_every_month"
                            v-model="everyMonthStates[expense.id]"
                            @update:model-value="(value, evt) => updateExpense(expense.id, {'is_deleted_at': !value})"
                            checked-icon="check"
                            color="info"
                            unchecked-icon="clear"
                        />
                        <EditButton v-if="expense.times && !editMode[expense.id]" @handleEdit="editMode[expense.id] = true"/>
                        <SaveIconButton v-if="expense.times && editMode[expense.id]" @handleSave="updateExpense(expense.id)"/>
                    </q-item-section>
                </template>
                <q-card>
                    <q-card-section>
                        <div v-if="expense.is_every_month">
                            <span class="text-caption">This expense happens every month. If you want to disable it, press toggle. You can create another regular expense, but there is no opportunity to edit the existing one.</span>
                        </div>
                        <div v-if="expense.times">
                            <q-item v-for="i in expense.times" dense>
                                <q-item-section>
                                    <span class="text-weight-thin text-caption">{{ useDateFormat(new Date(new Date(expense.created_at).setMonth(new Date(expense.created_at).getMonth() + (i-1))), 'YYYY-MM-DD').value }}</span>
                                </q-item-section>
                                <q-item-section>
                                    <q-icon v-if="(new Date(availableDates.prevStr)).getTime() < (new Date(new Date(expense.created_at).setMonth(new Date(expense.created_at).getMonth() + (i-1)))).getTime()" 
                                        color="negative" name="sym_o_close"
                                    />
                                    <q-icon v-else
                                        color="positive" 
                                        name="sym_o_done"
                                    />
                                </q-item-section>
                            </q-item>
                        </div>
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </div>
        <div class="flex flex-center q-mt-md" v-if="maxPage > 1">
            <q-pagination
                v-model="current"
                :max="maxPage"
            />
        </div>
    </div>
    <div v-else>
        <p class="text-center">No data available</p>
    </div>
</template>

<script setup>
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import useClient from '@/api/useClient';
import { onMounted, ref, watch } from 'vue';
import EditButton from '@/components/buttons/EditButton.vue';
import SaveIconButton from '../buttons/SaveIconButton.vue';
import { getAvailableDates, monthsSinceCustomStart } from '@/composables/getAvailableDates';
import { useMainStore } from '@/store/main';
import { useDateFormat } from '@vueuse/core';
import { useQuasar } from 'quasar';

const api = useClient();
const props = defineProps({
    userId: [String, Number],
    userNameTitle: String
});
const $q = useQuasar();

const mainStore = useMainStore();
const loading = ref(true);
const current = ref(1);
const maxPage = ref(5);
const scheduledExpenses = ref([]);
const everyMonthStates = ref({});
const editMode = ref({});
const availableDates = ref();

const updateExpense = async (id, args) => {
    const expense = scheduledExpenses.value.find(item => item.id == id);
    const requestData = {
        id: id
    };
    if (expense.is_every_month) {
        requestData.deleted_at = args.is_deleted_at ? new Date() : null;
    } else {
        requestData.times = expense.times;
    }
    if (editMode.value[id]) {
        editMode.value[id] = false;
    }
    const { error } = await api('/api/expense/scheduled/update').post(requestData).json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
    } else {
        $q.notify({
            type: 'positive',
            message: 'Scheduled expense has been successfully updated',
            color: 'positive'
        });
    }
};

const prepareData = async () => {
    loading.value = true;
    availableDates.value = getAvailableDates();
    const { data, error } = await api('/api/expense/scheduled?user_id=' + props.userId).get().json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
    } else {
        maxPage.value = data.value.last_page;
        current.value = data.value.current_page;
        scheduledExpenses.value = data.value.data;
        everyMonthStates.value = {};
        editMode.value = {};
        scheduledExpenses.value.forEach((item) => {
            if (item.is_every_month) {
                everyMonthStates.value[item.id] = item.deleted_at === null || item.deleted_at === '' || item.deleted_at === undefined;
            }
            if (item.times) {
                editMode.value[item.id] = false;
            }
        });
    }
    loading.value = false;
};

onMounted(() => {
    prepareData();
});

watch(
    () => props.userId,
    () => {
        loading.value = true;
        prepareData();
    }
);

</script>

<style lang="scss" scoped>
.item-wrapper {
    border: 1px solid var(--q-secondary);
    border-radius: var(--dp-border-radius);
    background-color: #fff;
}

@media (max-width: 475px) {
    .times-wrapper {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
    }   
}
</style>