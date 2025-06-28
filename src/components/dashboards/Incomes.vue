<template>
    <div id="chart-incomes"></div>
</template>

<script setup>
import useClient from '@/api/useClient';
import { useDateFormat } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import ApexCharts from 'apexcharts';
import { useMainStore } from '@/store/main';

const props = defineProps(['dateRange']);
const mainStore = useMainStore();
const api = useClient();

const loadedData = ref();
const chart = ref(null);

const loadData = async () => {
    const { data, error } = await api('api/dashboard/last_incomes').post({
        date: props.dateRange
    }).json();

    if (error.value) {
        //TO DO
    }
    loadedData.value = data.value;
};

const buildGraph = () => {
    const months = [];
    let monthIndex = props.dateRange[0]['month'];
    let yearIndex = props.dateRange[0]['year'];
    while (yearIndex < props.dateRange[1]['year'] || (yearIndex === props.dateRange[1]['year'] && monthIndex <= props.dateRange[1]['month'])) {
        const date = new Date(yearIndex, monthIndex, 1);
        const formatted = useDateFormat(date, 'YYYY-MMM', { locale: 'en-US' });
        months.push(formatted.value);

        monthIndex++;
        if (monthIndex > 11) {
            monthIndex = 0;
            yearIndex++;
        }
    }

    const series = [];
    const totalSerie = [];
    mainStore.state.users.forEach(user => {
        let userData = [];
        let monthIndex = props.dateRange[0]['month'];
        let yearIndex = props.dateRange[0]['year'];
        let index = 0;
        while (yearIndex < props.dateRange[1]['year'] || (yearIndex === props.dateRange[1]['year'] && monthIndex <= props.dateRange[1]['month'])) {
            const _userData = loadedData.value.filter(item => {
                return item.user_id == user.id && item.pseudo_month == yearIndex + "-" + String(monthIndex + 1).padStart(2, '0')
            });

            const value = _userData.reduce((acc, item) => {
                acc = Number(acc) + (Number(item.total_income) / mainStore.state.currencies.find(c => c.id == item.currency_id).rate);
                return Number(acc).toFixed(2);
            }, 0);
            totalSerie[index] = totalSerie[index] ? Number(Number(totalSerie[index]) + Number(value)).toFixed(2) : Number(value).toFixed(2); 
            userData.push(Number(value).toFixed(2));

            monthIndex++;
            if (monthIndex > 11) {
                monthIndex = 0;
                yearIndex++;
            }
            index++;
        }
        series.push({
            name: user.name,
            data: userData
        });
    });
    series.push({
        name: 'Total',
        data: totalSerie
    });

    const options = {
        series: series,
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        /*plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
          },
        },*/
        dataLabels: {
          enabled: false
        },
        /*stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },*/
        stroke: {
            curve: 'straight'
        },
        xaxis: {
          categories: months,
        },
        yaxis: {
          title: {
            text: 'Incomes, $'
          }
        },
        fill: {
          opacity: 1
        },
    };

    if (chart.value) {
        chart.value.destroy();
    }
    chart.value = new ApexCharts(document.querySelector('#chart-incomes'), options);
    chart.value.render();
};

const prepareData = async () => {
    await loadData();
    buildGraph();
};

onMounted(() => {
    prepareData();
});

watch(
    () => props.dateRange, 
    () => {
        prepareData();
    },
    { deep: true }
);
</script>