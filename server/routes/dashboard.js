import express from 'express';
import { Op, fn, col, literal } from 'sequelize';
import models from "#server/models/index.js";
import constants from "#shared/contants.js";
import { getDateRange } from "#shared/dates/helpers.js";

const { Income, CategoryExpense, Expense, CurrentState } = models;
const XDATE = constants.XDATE;

const dashboardRouter = express.Router();


dashboardRouter.post('/last_incomes', async function (req, res) {
    const dateRange = req.body.date;
    const { start, end } = getDateRange(dateRange);

    const pseudoMonthLiteral = literal(`
        CASE
            WHEN CAST(DATE_FORMAT(created_at, '%d') AS UNSIGNED) <= ${XDATE}
            THEN DATE_FORMAT(created_at, '%Y-%m')
            ELSE DATE_FORMAT(DATE_ADD(created_at, INTERVAL 15 DAY), '%Y-%m')
        END
    `);

    const totals = await Income.findAll({
        where: {
            created_at: {
                [Op.between]: [start, end]
            }
        },
        attributes: [
            'user_id',
            'currency_id',
            [pseudoMonthLiteral, 'pseudo_month'],
            [fn('SUM', col('sum')), 'total_income']
        ],
        group: [
            'user_id',
            'currency_id',
            literal('pseudo_month')
        ],
        order: [
            literal('pseudo_month')
        ],
        raw: true
    });

    return res.json(totals);
});

dashboardRouter.post('/last_expenses', async function (req, res) {
    const dateRange = req.body.date;
    const { start, end } = getDateRange(dateRange);

    const categories = await CategoryExpense.findAll({
        where: {
            isActive: true,
            special: false
        },
        attributes: ['id', 'title', 'str_id', 'currency_id'],
        raw: true
    });

    const categoryIds = categories.map(c => c.id);

    const pseudoMonthLiteral = literal(`
        CASE
            WHEN CAST(DATE_FORMAT(created_at, '%d') AS UNSIGNED) <= ${XDATE}
            THEN DATE_FORMAT(created_at, '%Y-%m')
            ELSE DATE_FORMAT(DATE_ADD(created_at, INTERVAL 15 DAY), '%Y-%m')
        END
    `);

    const categoriesWithAvg = await Expense.findAll({
        where: {
            created_at: {
                [Op.between]: [start, end]
            },
            category_id: {
                [Op.in]: categoryIds
            }
        },
        attributes: [
            'category_id',
            [pseudoMonthLiteral, 'pseudo_month'],
            [fn('SUM', col('sum')), 'sum_amount']
        ],
        group: [
            'category_id',
            literal('pseudo_month')
        ],
        order: [
            literal('pseudo_month')
        ],
        raw: true
    });

    return res.json({
        categories,
        avgs: categoriesWithAvg
    });
});

dashboardRouter.post('/last_states', async function (req, res) {
    const dateRange = req.body.date;
    const { start, end } = getDateRange(dateRange);

    const startMonth = start.toISOString().slice(0, 7);
    const endMonth = end.toISOString().slice(0, 7);

    const result = await CurrentState.findAll({
        where: {
            pseudo_month: {
                [Op.between]: [startMonth, endMonth]
            }
        },
        attributes: [
            'id',
            'user_id',
            'category_id',
            'pseudo_month',
            'sum'
        ],
        order: [['pseudo_month', 'ASC']],
        raw: true
    });

    return res.json(result);
});

export default dashboardRouter;
