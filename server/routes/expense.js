import express from 'express';
import { Op, fn, col } from 'sequelize';
import models from "#server/models/index.js";

const { Expense, CategoryExpense, RepeatableExpense, Currency } = models;

const expenseRouter = express.Router();

expenseRouter.get('/categories', function (req, res, next) {
    CategoryExpense.scope({method: ['userGroup', req.user.current_group_id]}).findAll({
        paranoid: true
    })
    .then((categories) => {
        res.json(categories);
    })
    .catch(err => next(err));
});

expenseRouter.get('/total', function (req, res, next) {
    Expense.scope('basePeriod', {method: ['userGroup', req.user.current_group_id]}).findAll({
        attributes: [
            'category_id',
            [fn('SUM', col('sum')), 'total']
        ],
        group: ['category_id']
    })
    .then((total) => {
        res.json(total);
    })
    .catch(err => next(err));
});

expenseRouter.get('/user/:user_id', function (req, res, next) {
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
    })
    .catch(err => next(err));
});

expenseRouter.post('/update', async function (req, res, next) {
    try {
        const expense = req.body.id ? 
            await Expense.scope({method: ['userGroup', req.user.current_group_id]}).findByPk(req.body.id) :
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
            RepeatableExpense.destroy({
                where: {
                    expense_id: expense.id
                }
            });
            RepeatableExpense.create({
                group_id: req.user.current_group_id,
                expense_id: expense.id,
                is_every_month: true
            });
        } else if (req.body.repeatable === 'x-times') {
            RepeatableExpense.destroy({
                where: {
                    expense_id: expense.id
                }
            });
            RepeatableExpense.create({
                group_id: req.user.current_group_id,
                expense_id: expense.id,
                times: req.body.repeat_times
            });
        }

        res.json(savedExpense);
    } catch (err) {
        next(err);
    }
});

expenseRouter.delete('/:expense_id/delete', async function (req, res, next) {
    const { expense_id } = req.params;

    await RepeatableExpense.destroy({
        where: {
            expense_id: expense_id
        },
        force: true
    })
    .catch(err => next(err));

    Expense.scope({method: ['userGroup', req.user.current_group_id]})
    .destroy({ where: { id: expense_id } })
    .then(() => {
        res.json({ message: 'Expense deleted successfully' });
    })
    .catch(err => next(err));
});

expenseRouter.get('/scheduled', async function (req, res, next) {
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
    const paranoid = req.query.show_deleted === '0';

    const repeatables = await RepeatableExpense.scope({method: ['userGroup', req.user.current_group_id]})
    .findAndCountAll({
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
        paranoid: paranoid
    })
    .catch(err => next(err));

    return res.json({
        total: repeatables.count,
        page,
        pages: Math.ceil(repeatables.count / limit),
        data: repeatables.rows
    });
});

expenseRouter.delete('/scheduled/:id/delete', async function (req, res, next) {
    await RepeatableExpense.scope({method: ['userGroup', req.user.current_group_id]})
    .destroy({
        where: {
            id: req.params.id
        }
    })
    .catch(err => next(err));

    return res.json(null);
});

expenseRouter.post('/scheduled/update', async function (req, res, next) {
    const repeatableExpense = await RepeatableExpense.scope({method: ['userGroup', req.user.current_group_id]})
    .findByPk(req.body.id, {
        paranoid: true
    });

    if (repeatableExpense.is_every_month) {
        repeatableExpense.deletedAt = req.body.deleted_at;
    } else {
        repeatableExpense.times = req.body.times;
    }

    await repeatableExpense.save().catch(err => next(err));
    return res.json(null);
});

export default expenseRouter;
