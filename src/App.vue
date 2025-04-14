<template>
  <RouterView/>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

const loadData = async () => {

};
onMounted(() => {
  loadData();
});
</script>

<style scoped>

</style>
