import constants from "#shared/contants.js";

const XDATE = constants.XDATE;

export const getDateRange = (dateRange) => {
    const today = new Date().getDate();
    let start, end;

    if (today > XDATE) {
        start = new Date(dateRange[0].year, dateRange[0].month + 1, XDATE + 1, 0, 0, 0);
        end = new Date(dateRange[1].year, dateRange[1].month + 2, XDATE, 23, 59, 59);
    } else {
        start = new Date(dateRange[0].year, dateRange[0].month, XDATE + 1, 0, 0, 0);
        end = new Date(dateRange[1].year, dateRange[1].month + 1, XDATE, 23, 59, 59);
    }

    return { start, end };
};

export function getCustomMonthDiff(fromDate, toDate = new Date()) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const startDay = XDATE;

    let months =
        (to.getFullYear() - from.getFullYear()) * 12 +
        (to.getMonth() - from.getMonth());

    if (from.getDate() >= startDay) {
        months--;
    }

  return Math.max(0, months);
}
