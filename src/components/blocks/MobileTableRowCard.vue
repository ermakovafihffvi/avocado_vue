<template>
    <div
        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        @click="(e) => handleRowClick(e, subProps.row)"
    >
        <q-card bordered flat>
            <q-card-section>
                <q-list dense>
                    <q-item v-for="col in subProps.cols" :key="col.name">
                        <q-item-section>
                            <div v-if="col.name == 'delete'" @click.stop class="card-delete-wrapper">
                                <DeleteButton
                                    @handle-delete="handleDelete(subProps.row.id)" 
                                />
                            </div>
                            <q-item-label v-else>{{ col.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label caption>{{ subProps.row[col.name] }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import DeleteButton from '@/components/buttons/DeleteButton.vue';

const props = defineProps(['subProps']);

const emit = defineEmits(['handleDelete', 'handleRowClick']);

const handleDelete = (id) => {
    emit('handleDelete', id);
};

const handleRowClick = (e, row) => {
    emit('handleRowClick', e, row);
}
</script>
