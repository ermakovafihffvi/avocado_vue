<template>
    <div class="detailed-expenses-table-wrapper">
        <q-table
            :grid="$q.screen.xs"
            :rows="rows"
            :columns="columns"
            row-key="id"
            :separator="'cell'"
            hide-pagination
            :pagination="{
                rowsPerPage: 0
            }"
        >
            <template v-slot:body-cell-delete="props">
                <q-td :props="props" @click.stop>
                    <DeleteButton @handle-delete="handleDelete(props.row.id)"/>
                </q-td>
            </template>
            <template v-slot:item="subProps">
                <MobileTableRowCard :subProps="subProps" />
            </template>
        </q-table>
    </div>
</template>

<script setup>
import DeleteButton from '@/components/buttons/DeleteButton.vue';
import { onMounted, computed, ref } from 'vue';
import { useDateFormat } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import MobileTableRowCard from '@/components/blocks/MobileTableRowCard.vue';

const { t } = useI18n();
const api = useClient();
const mainStore = useMainStore();

const props = defineProps({
    category: {
        type: Object,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    deletionAllowed: {
        type: Boolean,
        required: false,
        default: true
    }
});

const columns = ref([
    {
        name: 'desc',
        required: true,
        label: t('common.description'),
        align: 'left',
        field: row => row.desc,
        format: val => `${val}`,
        sortable: true,
        sort: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
    },
    {
        name: 'sum',
        required: true,
        label: t('common.sum'),
        align: 'left',
        field: row => row.sum,
        format: val => `${val}`,
        sortable: true,
        sort: (a, b) => a - b
    },
    {
        name: 'date',
        required: true,
        label: t('common.date'),
        align: 'left',
        field: row => row.date,
        format: val => `${val}`,
        sortable: false
    }
]);

const rows = computed(() => {
    return mainStore.state.usersExpenses[props.user.id]?.filter(i => i.category_id == props.category.id)
        .map(item => {
            item.date = useDateFormat(item.created_at, 'YYYY-MM-DD')
            return item;
        });
});

const handleDelete = async (id) => {
    const { error } = await api(`/api/expense/${id}/delete`).delete().json();
    if (error.value) {

    } else {
        mainStore.state.usersExpenses[props.user.id] = mainStore.state.usersExpenses[props.user.id].reduce(function (acc, item) {
            if (item.id !== id) {
                acc.push(item);
            }
            return acc;
        }, []);
    }
};

onMounted(() => {
    if (props.deletionAllowed) {
        columns.value.push({
            name: 'delete',
            required: true,
            label: t('common.delete'),
            align: 'left'
        });
    }
});

</script>

<style lang="scss">
.detailed-expenses-table-wrapper>div {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
}
.body--light {
    .detailed-expenses-table-wrapper table thead tr {
        background-color: $secondary-light;
    }
}  
.body--dark {
    .detailed-expenses-table-wrapper table thead tr {
        background-color: $secondary-dark;
    }
}
.card-delete-wrapper {
    width: fit-content;
    align-self: end;
}
</style>
