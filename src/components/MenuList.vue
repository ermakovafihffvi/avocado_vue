<template>
    <q-list padding class="text-primary">
        <q-item
            clickable
            v-ripple
            :active="link === 'rates'"
            @click="link = 'rates'"
            active-class="my-menu-link"
        >
            <q-item-section avatar>
                <q-icon name="price_change" />
            </q-item-section>
            <q-item-section>Set Rates</q-item-section>
        </q-item>

        <q-expansion-item
            v-model="expanded_users"
            label="Money Users"
        >
            <q-item
                clickable
                v-ripple
                :active="link === 'user_stats'"
                @click="link = 'user_stats'"
                active-class="my-menu-link"
            >
                <q-item-section avatar>
                    <q-icon name="person_outline" />
                </q-item-section>

                <q-item-section>Alex</q-item-section>
            </q-item>
        </q-expansion-item>

        <q-separator spaced />

        <q-item>
            <q-btn class="absolute-center">Logout</q-btn>
        </q-item>
    </q-list>
</template>

<script setup>
import { ref } from 'vue';

const expanded_users = ref(true);
const link = ref('');
</script>