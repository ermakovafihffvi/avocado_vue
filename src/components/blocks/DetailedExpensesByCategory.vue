<template>
    <div v-for="user in users" :key="user.id" class="q-py-xs">
        <q-expansion-item switch-toggle-side expand-separator class="item-wrapper" v-model="isExpanded[user.id]">
            <template v-slot:header>
                <q-item-section>
                    <span class="text-weight-bold text-h6 text-info">{{ user.name }}</span>
                </q-item-section>
            </template>
            <q-card>
                <detailed-expenses-by-user-by-category :user="user" :category="category" :deletion-allowed="deletionAllowed"/>
            </q-card>
        </q-expansion-item>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import DetailedExpensesByUserByCategory from '@/components/tables//DetailedExpensesByUserByCategory.vue';

const props = defineProps({
    category: {
        type: Object,
        required: true
    },
    users: {
        type: Array,
        required: true
    },
    expanded: {
        type: Boolean,
        required: false,
        default: false
    },
    deletionAllowed: {
        type: Boolean,
        required: false,
        default: true
    }
});

const isExpanded = ref({});

onBeforeMount(() => {
    props.users?.forEach(user => isExpanded.value[user.id] = props.expanded);
});
</script>

<style lang="scss" scoped>
.item-wrapper {
    border: 1px solid var(--q-secondary);
    border-radius: var(--dp-border-radius);
    overflow: hidden;
}
.body--light {
    .item-wrapper {
        background-color: #fff;
    }
}
</style>
<style lang="sass" scoped>
@media (min-width: 641px) 
    .item-wrapper
        width: 600px; 
</style>