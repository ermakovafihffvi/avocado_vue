<template>
    <div id="chart-expenses"></div>
</template>

<script setup>
import useClient from '@/api/useClient';
import { useMainStore } from '@/store/main';
import { useDateFormat } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import ApexCharts from 'apexcharts';


const api = useClient();
const props = defineProps(['dateRange']);
const mainStore = useMainStore();

const loadedData = ref();
const chart = ref(null);

const loadData = async () => {
    const { data, error } = await api('api/dashboard/last_expenses').post({
        date: props.dateRange
    }).json();
    if (error.value) {
        console.error(error.value);
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
    loadedData.value.categories.forEach(category => {
        let categoryData = [];
        let monthIndex = props.dateRange[0]['month'];
        let yearIndex = props.dateRange[0]['year'];
        let index = 0;
        while (yearIndex < props.dateRange[1]['year'] || (yearIndex === props.dateRange[1]['year'] && monthIndex <= props.dateRange[1]['month'])) {
            const _categoryData = loadedData.value.avgs.filter(item => {
                return item.category_id == category.id && item.pseudo_month == yearIndex + "-" + String(monthIndex + 1).padStart(2, '0')
            });

            const value = _categoryData.reduce((acc, item) => {
                acc = Number(acc) + (Number(item.sum_amount) / mainStore.state.currencies.find(c => c.id == category.currency_id).rate);
                return Number(acc).toFixed(2);
            }, 0);
            categoryData.push(Number(value).toFixed(2));

            monthIndex++;
            if (monthIndex > 11) {
                monthIndex = 0;
                yearIndex++;
            }
            index++;
        }
        series.push({
            name: category.title,
            data: categoryData
        });
    });

    const options = {
        series: series,
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: false
            }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            borderRadiusApplication: 'end', // 'around', 'end'
            borderRadiusWhenStacked: 'last', // 'all', 'last'
            dataLabels: {
              total: {
                enabled: true,
                style: {
                    fontSize: '13px',
                    fontWeight: 900
                }
              }
            }
          },
        },
        xaxis: {
            type: 'category',
            categories: months,
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        }
    };

    if (chart.value) {
        chart.value.destroy();
    }
    chart.value = new ApexCharts(document.querySelector('#chart-expenses'), options);
    chart.value.render();
};

const prepareGraph = async () => {
    await loadData();
    buildGraph();
};

onMounted(() => {
    prepareGraph();
});

watch(
    () => props.dateRange,
    () => {
        prepareGraph();
    },
    { deep: true }
);
</script>