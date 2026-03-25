import constants from "#shared/contants.js";

const XDATE = constants.XDATE;

export const getDateRange = (dateRange) => {
    const today = new Date().getDate();
    let start, end;

    if (today > XDATE) {
        start = new Date(dateRange[0].year, dateRange[0].month, XDATE + 1);
        end = new Date(dateRange[1].year, dateRange[1].month + 1, XDATE, 23, 59, 59);
    } else {
        start = new Date(dateRange[0].year, dateRange[0].month - 1, XDATE + 1);
        end = new Date(dateRange[1].year, dateRange[1].month, XDATE, 23, 59, 59);
    }

    return { start, end };
};
