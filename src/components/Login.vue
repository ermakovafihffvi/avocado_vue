<template>
    <div class="column">
        <h3 class="text-center q-mb-md q-mx-md">{{ $t('common.app_name') }}</h3>
        <loading-spinner v-if="loading"/>
        <q-form class="column q-mx-md" v-else>
            <q-input outlined v-model="login" :label="$t('common.login')" class="q-mb-md"/>
            <q-input outlined v-model="password" 
                :type="isPwd ? 'password' : 'text'" 
                :label="$t('common.password')" 
                class="q-mb-md"
                :rules="[(val) => passwordTest(val) || ($t('validation.password') + ' ' + $t('validation.min_length', {min: 4}))]"
                ref="passwordRef"
            >
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
            <q-input outlined v-model="repeatedNewPassword" v-if="showRepeatPassword"
                :type="isPwd ? 'password' : 'text'" 
                :label="$t('common.repeat_new_pswd')" 
                class="q-mb-md"
                :rules="[
                    (val) => val == password || $t('validation.pswd_repeat'),
                    (val) => passwordTest(val) || ($t('validation.password') + ' ' + $t('validation.min_length', {min: 4}))
                ]"
                ref="repeatedNewPasswordRef"
            >
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
            
            <q-btn color="primary" :label="$t('common.login')" @click="handleLogin" />

            <q-btn color="accent" class="q-mt-md" :label="$t('common.register')" @click="handleRegistrationBtn"/>
        </q-form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import useClient from '@/api/useClient';
import router from '@/router';
import { useMainStore } from '@/store/main';
import { useQuasar } from 'quasar';
import validationRules from '@shared/validation/rules.js';
import LoadingSpinner from './base/LoadingSpinner.vue';

const api = useClient();
const mainStore = useMainStore();
const $q = useQuasar();
const { passwordTest } = validationRules();

const login = ref('');
const password = ref('');
const repeatedNewPassword = ref('');
const showRepeatPassword = ref(false);
const isPwd = ref(true);
const loading = ref(false);

const passwordRef = ref();
const repeatedNewPasswordRef = ref();

const isRegisterDisabled = computed(() => {
    return !password.value || passwordRef.value?.hasError ||
        !repeatedNewPassword.value || repeatedNewPasswordRef.value?.hasError;
});
const isPreRegisterDisabled = computed(() => {
    return !password.value || passwordRef.value?.hasError;
});

const handleLogin = async () => {
    if (!password.value || passwordRef.value?.hasError) return;
    loading.value = true;
    const { error, data } = await api('api/login').post(
        {
            name: login.value,
            password: password.value
        }
    ).json();
    loading.value = false;
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
    }
    mainStore.state.currentUser = data.value['current-user'];

    if (!error.value) {
       router.push('/'); 
    }
};

const handleRegistrationBtn = async () => {
    if (isPreRegisterDisabled.value) return;
    if (showRepeatPassword.value) {
        return await handleRegistration();
    }
    const { error, data, response } = await api('api/user-exists/' + login.value).get().json();
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
        showRepeatPassword.value = false;
    } else {
        showRepeatPassword.value = true;
    }
};

const handleRegistration = async () => {
    if (isRegisterDisabled.value) return;
    loading.value = true;
    const { error, data } = await api('api/signup').post(
        {
            name: login.value,
            password: password.value
        }
    ).json();
    loading.value = false;
    if (error.value) {
        $q.notify({
            type: 'error',
            message: error.value,
            color: 'negative'
        });
        return;
    }
    mainStore.state.currentUser = data.value['current-user'];

    if (!error.value) {
       router.push('/'); 
    }
};

</script>
