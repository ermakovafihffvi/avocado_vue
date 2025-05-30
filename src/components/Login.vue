<template>
    <div class="column">
        <h3 class="text-center q-mb-md">Login</h3>
        <q-form class="column">
            <q-input outlined v-model="login" label="Label" class="q-mb-md"/>
            <q-input outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="Password" class="q-mb-md">
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
            
            <q-btn color="primary" label="Submit" @click="handleLogin" />
        </q-form>

        <!--<a href="#" class="text-subtitle1">Register</a>-->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useClient from '@/api/useClient';
import router from '@/router';
import { useMainStore } from '@/store/main';

const api = useClient();
const mainStore = useMainStore();

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
    console.error(error.value);
    console.log(data); //TO DO CHECK
    mainStore.state.currentUser = data.value['current-user'];

    if (!error.value) {
       router.push('/'); 
    }
};

</script>