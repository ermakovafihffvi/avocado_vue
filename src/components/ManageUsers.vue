<template>
    <loading-spinner v-if="isLoading || loading || !currentUser"/>
    <q-list bordered padding v-else class="q-mx-md users-list">
        <q-item-label header>
            {{ $t('common.activate_users') }}
        </q-item-label>

        <q-expansion-item v-if="usersData?.length"
            v-for="user in usersData" :key="user.id"
            class="cursor-pointer" 
            v-ripple 
            switch-toggle-side
            expand-separator
        >
            <template v-slot:header>
                <q-item-section>
                    {{ user.name }}
                </q-item-section>
                <q-item-section side>
                    <q-toggle color="secondary" v-model="activeMap[user.id]" 
                        @update:model-value="(value) => handleUserActivation(user.id, value)"
                    />
                </q-item-section>
            </template>
            <q-card flat style="background-color: var(--q-dark-page);">
                <q-card-section>
                    <q-input v-model="newPassword[user.id]" 
                        :type="'text'"
                        :label="$t('common.new_pswd')" 
                        class="q-mt-md"
                        :rules="[(val) => passwordTest(val) || ($t('validation.password') + ' ' + $t('validation.min_length', {min: 4}))]"
                        :ref="(el) => setRef(el, user.id + '-password')"
                        :autocomplete="'new-password'"
                    />
                </q-card-section>
                <q-card-section class="row" style="gap: 10px;">
                    <delete-button @handle-delete="deleteUser(user.id)"/>
                    <div class="text-subtitle3 col">
                        {{ $t('messages.info.user_deletion') }}
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn color="primary" flat @click="updatePassword(user.id)">{{ $t('common.submit') }}</q-btn>
                </q-card-actions>
            </q-card>
        </q-expansion-item>
        <q-item v-else>
            <no-data />
        </q-item>

        <q-separator spaced />

        <q-item v-ripple tag="label" @click="addSlot">
            <q-item-section>
                <q-item-label>{{ $t('common.add_user') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
                <q-icon name="add"/>
            </q-item-section>
        </q-item>

        <q-item v-for="slot in slots" :key="slot.uuid">
            <q-item-section>
                <q-input type="text" v-model="slot.name" 
                    :label="$t('common.login')"
                    :rules="[val => anyStringTest(val) || $t('validation.string', { field: $t('common.title') }) + '. ' + $t('validation.required')]"
                    :readonly="!!slot.id"
                    :ref="(el) => setRef(el, slot.uuid + '-name')"
                />
                <q-input v-if="!slot.id" type="text" v-model="slot.password" 
                    class="q-mb-md"
                    :label="$t('common.password')"
                    :rules="[(val) => passwordTest(val) || ($t('validation.password') + ' ' + $t('validation.min_length', {min: 4}))]"
                    :ref="(el) => setRef(el, slot.uuid + '-password')"
                />
            </q-item-section>
            <q-item-section v-if="!slot.id" side>
                <delete-button @handle-delete="deleteSlot(slot.uuid)"/>
            </q-item-section>
        </q-item>
        <q-item v-if="slots.length">
            <q-item-section>
                <q-btn push color="primary" @click="handleUsersSave">{{ $t('common.submit') }}</q-btn>
            </q-item-section>
        </q-item>

    </q-list>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { onMounted, ref, computed, watch } from 'vue';
import { useQuery } from '@pinia/colada';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import DeleteButton from '@/components/buttons/DeleteButton.vue';
import validationRules from '@shared/validation/rules.js';
import NoData from '@/components/base/NoData.vue';

const $q = useQuasar();
const { t } = useI18n();
const mainStore = useMainStore();
const api = useClient();
const { anyStringTest, requiredTest, passwordTest } = validationRules();

const slots = ref([]);
const activeMap = ref({});
const loading = ref();
const currentUser = computed(() => mainStore.state.currentUser);
const newPassword = ref({});
const usersData = computed(() => users.value.data?.filter(i => i.id != currentUser.value.id));

const inputRefs = ref({});
const setRef = (el, key) => {
    inputRefs.value[key] = el;
};

const {
    state: users,
    refetch,
    isLoading,
} = useQuery({
    key: ['users'],
    query: async () => {
        const {data, error} = await api('api/users-list?deleted=true').get().json();
        if (error.value) {
            $q.notify({
                type: 'error',
                message: error.value,
                color: 'negative'
            });
            throw new Error(error.value);
        } else {
            return data.value;
        }
    }
}, {immediate: true});

const addSlot = () => {
    slots.value.unshift({
        uuid: uuidv4(),
        name: '',
        password: ''
    });
};

const deleteSlot = (uuid) => {
    slots.value = slots.value.filter((i) => i.uuid != uuid);
};

const handleUsersSave = async () => {
    loading.value = true;
    const reqData = slots.value.filter(slot => {
        const nameRef = inputRefs.value[slot.uuid + '-name'];
        const passRef = inputRefs.value[slot.uuid + '-password'];
        return !nameRef?.hasError && !passRef?.hasError && slot.name && slot.password;
    });
    const { error } = await api('api/add-users').post(reqData).json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
    } else {
        slots.value = [];
        mainStore.state.users = null;
        mainStore.loadUsersList();
        await refetch();
    }
    loading.value = false;
};

const updatePassword = async (userId) => {
    const password = newPassword.value?.[userId];
    const inputComponent = inputRefs.value[userId];
    if (inputComponent && inputComponent.hasError) {
        return;
    }
    const reqData = {
        userId: userId,
        password: password
    };
    const { error, data } = await api('api/update-user').post(reqData).json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
    } else {
        $q.notify({
            type: 'positive',
            message: t('messages.success.pswd_updated'),
            color: 'positive'
        });
    }
};

const handleUserActivation = async (userId, value) => {
    const reqData = {
        userId: userId,
        isActive: value
    };
    const { error, data } = await api('api/update-user').post(reqData).json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
    } else {
        $q.notify({
            type: 'positive',
            message: value ? t('messages.success.user_activated') : t('messages.success.user_deactivated'),
            color: 'positive'
        });
    }
};

const deleteUser = async (id) => {
    const { error, data } = await api('api/user/' + id + '/delete').delete().json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
    } else {
        $q.notify({
            type: 'positive',
            message: t('messages.success.user_deleted'),
            color: 'positive'
        });
        slots.value = [];
        mainStore.state.users = mainStore.state.users.filter(u => u.id != id);
        await refetch();
    }
};

watch(users, () => {
    users.value.data?.forEach(element => {
        activeMap.value[element.id] = !Boolean(element.deleted_at);
    });
});
</script>

<style lang="sass" scoped>
@media (min-width: 641px) 
    .users-list
        width: 600px; 
        margin-left: auto !important;
        margin-right: auto !important;
</style>
