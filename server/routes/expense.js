import express from 'express';
import { fn, col } from 'sequelize';
import models from "#server/models/index.js";

const { Expense, CategoryExpense } = models;

const expenseRouter = express.Router();

expenseRouter.get('/categories', function (req, res) {
    CategoryExpense.scope({method: ['userGroup', req.user.current_group_id]}).findAll({
        paranoid: false
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
            special: isSpecial,
            isActive: true 
        },
        include: [
            {
                model: CategoryExpense,
                as: 'category'
            }
        ]
    })
    .then((expenses) => {
        res.json(expenses);
    });
});

expenseRouter.post('/update', async function (req, res) {
    const expense = req.body.id ? 
        Expense.scope({method: ['userGroup', req.user.current_group_id]})
        .findOne({
            where: { id: req.body.id }
        }) :
        Expense.build({
            group_id: req.user.current_group_id,
        });

    expense.desc = req.body.desc;
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

expenseRouter.get('/scheduled', function (req, res) {
    
});

export default expenseRouter;
