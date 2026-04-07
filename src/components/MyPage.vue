<template>
    <div class="my-page q-px-md">
        <q-input
            :label="$t('common.my_login_name')"
            v-model="myName"
            readonly
        >
            <template v-slot:before>
                <q-icon name="assignment_ind" />
            </template>
        </q-input>

        <q-input v-model="currentPassword" 
            outlined
            type="password"
            :label="$t('common.current_pswd')"
            class="q-mt-md" 
            :rules="[(val) => requiredTest(val) || $t('validation.required')]"
            ref="currentPasswordRef"
            :autocomplete="'new-password'"
        />
        <q-input v-model="newPassword" 
            outlined
            :type="isPwd ? 'password' : 'text'"
            :label="$t('common.new_pswd')" 
            class="q-mt-md"
            :rules="[(val) => passwordTest(val) || ($t('validation.password') + ' ' + $t('validation.min_length', {min: 4}))]"
            ref="newPasswordRef"
            :autocomplete="'new-password'"
        >
            <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
            </template>
        </q-input>
        <q-input v-model="repeatedNewPassword" 
            outlined
            :type="isPwd ? 'password' : 'text'"
            :label="$t('common.repeat_new_pswd')" 
            class="q-mt-md"
            :rules="[
                (val) => val == newPassword || $t('validation.pswd_repeat'),
                (val) => passwordTest(val) || ($t('validation.password') + ' ' + $t('validation.min_length', {min: 4}))
            ]"
            ref="repeatedNewPasswordRef"
            :autocomplete="'new-password'"
        >
            <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
            </template>
        </q-input>
        <q-btn push color="primary" 
            :disabled="isSubmitDisabled"
            class="q-mt-lg float-right"
            :label="$t('common.submit')" 
            @click="handleMeUpdate"
        />
    </div>
</template>

<script setup>
//import bcrypt from "bcryptjs";
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useMainStore } from '@/store/main';
import validationRules from '@shared/validation/rules.js';
import useClient from '@/api/useClient';

const mainStore = useMainStore();
const { requiredTest, passwordTest } = validationRules();
const api = useClient();
const $q = useQuasar();
const { t } = useI18n();

const myName = computed(() => mainStore.state.currentUser?.name);
const isPwd = ref(true);

const currentPassword = ref('');
const newPassword = ref('');
const repeatedNewPassword = ref('');

const currentPasswordRef = ref();
const newPasswordRef = ref();
const repeatedNewPasswordRef = ref();

const isSubmitDisabled = computed(() => {
    return !currentPassword.value || currentPasswordRef.value?.hasError ||
        !newPassword.value || newPasswordRef.value?.hasError ||
        !repeatedNewPassword.value || repeatedNewPasswordRef.value?.hasError;
});

const handleMeUpdate = async () => {
    if (isSubmitDisabled.value) return;
    const reqData = {
        password: newPassword.value
    };
    const { error } = await api('api/me/update').post(reqData).json();
    if (error) {
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

onMounted(async () => {
    /*let salt = await bcrypt.genSalt(12);
    let a = await bcrypt.hash('123456', salt);
    console.log(a);
    let b = await bcrypt.hash('123456', salt);
    console.log(b);*/
})

</script>

<style>
</style>

<style lang="sass" scoped>
@media (min-width: 641px) 
    .my-page
        width: 600px; 
</style>
