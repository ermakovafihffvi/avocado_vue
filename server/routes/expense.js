import express from 'express';
import { Op, fn, col } from 'sequelize';
import models from "#server/models/index.js";

const { Expense, CategoryExpense, RepeatableExpense, Currency } = models;

const expenseRouter = express.Router();

expenseRouter.get('/categories', function (req, res) {
    CategoryExpense.scope({method: ['userGroup', req.user.current_group_id]}).findAll({
        paranoid: true
    })
    .then((categories) => {
        res.json(categories);
    });
});

expenseRouter.get('/total', function (req, res) {
    Expense.scope('basePeriod', {method: ['userGroup', req.user.current_group_id]}).findAll({
        attributes: [
            'category_id',
            [fn('SUM', col('sum')), 'total']
        ],
        group: ['category_id']
    })
    .then((total) => {
        res.json(total);
    });
});

expenseRouter.get('/user/:user_id', function (req, res) {
    const isSpecial = req.query.special == 1;

    Expense.scope('basePeriod', {method: ['userGroup', req.user.current_group_id]}).findAll({
        where: { 
            user_id: req.params.user_id,
        },
        include: [
            {
                model: CategoryExpense,
                as: 'category',
                where: { 
                    special: isSpecial,
                    isActive: true 
                },
            }
        ]
    })
    .then((expenses) => {
        res.json(expenses);
    });
});

expenseRouter.post('/update', async function (req, res) {
    const expense = req.body.id ? 
        Expense.scope({method: ['userGroup', req.user.current_group_id]}).findByPk(req.body.id) :
        Expense.build({
            group_id: req.user.current_group_id,
        });

    expense.desc = req.body.description;
    expense.sum = req.body.sum;
    expense.user_id = req.body.user_id;
    expense.category_id = req.body.category_id;
    expense.createdAt = new Date(req.body.date);

    const savedExpense = await expense.save();

    if (req.body.repeatable === 'every-month') {
        savedExpense.createRepeatableExpense({
            is_every_month: true,
        });
    } else if (req.body.repeatable === 'x-times' && req.body.repeat_times > 0) {
        savedExpense.createRepeatableExpense({
            times: req.body.repeat_times,
        });
    }

    res.json(savedExpense);
});

expenseRouter.delete('/:expense_id/delete', function (req, res) {
    const { expense_id } = req.params;

    Expense.scope({method: ['userGroup', req.user.current_group_id]})
    .destroy({ where: { id: expense_id } })
    .then(() => {
        res.json({ message: 'Expense deleted successfully' });
    });
});

expenseRouter.get('/scheduled', async function (req, res) {
    const limit = 15;
    const page = parseInt(req.query.page || 1);
    const offset = (page - 1) * limit;

    const where = {};
    const expenseWhere = {};

    // Filter is_every_month
    if (req.query.is_every_month !== undefined) {
        where.is_every_month = req.query.is_every_month === 'true';
    }

    // Filter user_id through relation
    if (req.query.user_id) {
        expenseWhere.user_id = req.query.user_id;
    }

    // Soft delete logic
    let paranoid = false;

    if (req.query.only_deleted) {
        where.deletedAt = { [Op.ne]: null };
    } else if (req.query.without_deleted) {
        where.deletedAt = null;
    }

    const repeatables = await RepeatableExpense.findAndCountAll({
        where,
        include: [
            {
                model: Expense,
                as: 'expense',
                attributes: ['id', 'desc', 'user_id', 'category_id', 'sum'],
                where: Object.keys(expenseWhere).length ? expenseWhere : undefined,
                required: !!req.query.user_id,
                include: [
                    {
                        model: CategoryExpense,
                        as: 'category',
                        attributes: ['id', 'title', 'currency_id'],
                        include: [
                            {
                                model: Currency,
                                as: 'currency',
                                attributes: ['id', 'str_id']
                            }
                        ]
                    }
                ]
            }
        ],
        order: [['id', 'DESC']],
        limit,
        offset,
        paranoid
    });

    return res.json({
        total: repeatables.count,
        page,
        pages: Math.ceil(repeatables.count / limit),
        data: repeatables.rows
    });
});

expenseRouter.post('/scheduled/update', async function (req, res) {
    const repeatableExpense = await RepeatableExpense.findByPk(req.body.id, {
        paranoid: true
    });

    if (repeatableExpense.is_every_month) {
        repeatableExpense.deletedAt = req.body.deleted_at;
    } else {
        repeatableExpense.times = req.body.times;
    }

    await repeatableExpense.save();
    return res.json(null);
});

export default expenseRouter;
