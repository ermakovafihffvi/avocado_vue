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
        now = new Date(to);
    } 
    sixMonthsAgo.setMonth(now.getMonth() - monthPeriod);

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

export const monthsSinceCustomStart = (createdAtStr, customDay) => {
    const now = new Date();
    const createdAt = new Date(createdAtStr);

    // Сдвигаем обе даты на customDay
    const created = new Date(createdAt);
    const current = new Date(now);

    // Если день меньше X, значит ещё не наступил "новый месяц"
    if (created.getDate() < customDay) {
        created.setDate(customDay);
    } else {
        created.setMonth(created.getMonth() + 1);
        created.setDate(customDay);
    }

    if (current.getDate() < customDay) {
        current.setDate(customDay);
    } else {
        current.setMonth(current.getMonth() + 1);
        current.setDate(customDay);
    }

    // Вычисляем разницу в месяцах
    const yearsDiff = current.getFullYear() - created.getFullYear();
    const monthsDiff = current.getMonth() - created.getMonth();

    const totalMonths = yearsDiff * 12 + monthsDiff;

    // Если получилось < 0, значит дата в будущем — возвращаем 0
    return Math.max(totalMonths, 0);
}