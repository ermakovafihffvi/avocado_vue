import models from "#server/models/index.js";
import { getCustomMonthDiff } from "#shared/dates/helpers.js";
import { Op } from 'sequelize';

export const setScheduledExpenses = async () => {
    const { Expense, RepeatableExpense } = models;

    const repeatables = await RepeatableExpense.findAll({
        where: {
            expense_id: { [Op.not]: null }
        }
    });

    repeatables.forEach(async (repeatable) => {
        const expense = await Expense.findByPk(repeatable.expense_id);

        if (repeatable.is_every_month 
            || (repeatable.times && getCustomMonthDiff(expense.created_at) < repeatable.times)
        ) {
            if (expense) {
                await Expense.create({
                    category_id: expense.category_id,
                    desc: expense.desc,
                    user_id: expense.user_id,
                    sum: expense.sum,
                    group_id: expense.group_id
                });
            }
        }
    });
};
