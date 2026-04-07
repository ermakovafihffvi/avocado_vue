<template>
    <div class="column">
        <h3 class="text-center q-mb-md">{{ $t('common.login') }}</h3>
        <q-form class="column q-mx-md">
            <q-input outlined v-model="login" :label="$t('common.login')" class="q-mb-md"/>
            <q-input outlined v-model="password" :type="isPwd ? 'password' : 'text'" :label="$t('common.password')" class="q-mb-md">
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
            
            <q-btn color="primary" :label="$t('common.login')" @click="handleLogin" />

            <q-btn color="accent" class="q-mt-md" :label="$t('common.register')" @click="handleRegistration"/>
        </q-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useClient from '@/api/useClient';
import router from '@/router';
import { useMainStore } from '@/store/main';
import { useQuasar } from 'quasar';

const api = useClient();
const mainStore = useMainStore();
const $q = useQuasar();

const login = ref('');
const password = ref('');
const isPwd = ref(true);

const handleLogin = async () => {
    const { error, data } = await api('api/login').post(
        {
            name: login.value,
            password: password.value
        }
    ).json();
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

const handleRegistration = async () => {
    const { error, data } = await api('api/signup').post(
        {
            name: login.value,
            password: password.value
        }
    ).json();
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

</script>
