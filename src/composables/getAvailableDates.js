export const getAvailableDates = () => {
    const today = new Date();

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