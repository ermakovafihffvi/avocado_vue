import { useDateFormat } from '@vueuse/core';

export const getAvailableDates = (date = null) => {
    const today = date ?? new Date();

    if (today.getDate() > 22) {
        return {
            'prevStr': today.getFullYear() + '/' +
                String(today.getMonth() + 1).padStart(2, '0') + '/' +
                '23',
            'nextStr': today.getFullYear() + '/' +
                String(today.getMonth() + 2).padStart(2, '0') + '/' +
                '22'
        };
    } else {
        return {
            'prevStr': today.getFullYear() + '/' +
                String(today.getMonth()).padStart(2, '0') + '/' +
                '23',
            'nextStr': today.getFullYear() + '/' +
                String(today.getMonth() + 1).padStart(2, '0') + '/' +
                '22'
        };
    }
};

export const getDateRange = (monthPeriod, to = null) => {
    if (monthPeriod >= 6 || !Number(monthPeriod)) {
        console.error('month period shoul be less then 6');
        return; //TO DO
    }

    let now = new Date();
    let sixMonthsAgo = new Date();
    if (to) {
        sixMonthsAgo = new Date(to);
        now = (new Date(to));
        now.setMonth(sixMonthsAgo.getMonth() - monthPeriod);
    } else {
        sixMonthsAgo.setMonth(now.getMonth() - monthPeriod);
    }

    const dateRange = [];
    dateRange[1] = {
        "month": now.getMonth(),
        "year": now.getFullYear()
    };
    dateRange[0] = {
        "month": sixMonthsAgo.getMonth(),
        "year": sixMonthsAgo.getFullYear()
    };

    return dateRange;
};

export const getPeriodsList = (dateRange) => {
    const months = [];
    let monthIndex = dateRange[0]['month'];
    let yearIndex = dateRange[0]['year'];
    while (yearIndex < dateRange[1]['year'] || (yearIndex === dateRange[1]['year'] && monthIndex <= dateRange[1]['month'])) {
        const date = new Date(yearIndex, monthIndex, 1);
        const formatted = useDateFormat(date, 'YYYY-MMM', { locale: 'en-US' });
        months.push({
            [yearIndex + '-' + String(monthIndex + 1).padStart(2, '0')]: formatted.value
        });

        monthIndex++;
        if (monthIndex > 11) {
            monthIndex = 0;
            yearIndex++;
        }
    }
    return months;
};