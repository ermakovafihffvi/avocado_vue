import express from 'express';
import { fn, col } from 'sequelize';
import models from "#server/models/index.js";

const { Income } = models;

const incomeRouter = express.Router();

incomeRouter.get('/total', function (req, res) {
    Income.scope('basePeriod', {method: ['userGroup', req.user.current_group_id]}).findAll({
        attributes: [
            'user_id',
            'currency_id',
            [fn('SUM', col('sum')), 'total']
        ],
        group: ['user_id', 'currency_id']
    })
    .then((total) => {
        res.json(total);
    });
});

incomeRouter.get('/user/:user_id', function (req, res) {
    Income.scope('basePeriod', {method: ['userGroup', req.user.current_group_id]}).findAll({
        where: { user_id: req.params.user_id }
    })
    .then((incomes) => {
        res.json(incomes);
    });
});

incomeRouter.post('/update', async function (req, res) {
    const income = req.body.id ? 
        await Income.scope({method: ['userGroup', req.user.current_group_id]})
        .findOne({
            where: { id: req.body.id }
        }) :
        Income.build({
            group_id: req.user.current_group_id,
        });

    income.desc = req.body.desc;
    income.sum = req.body.sum;
    income.currency_id = req.body.currency_id;
    income.user_id = req.body.user_id;
    income.createdAt = new Date(req.body.date);

    income.save().then((savedIncome) => {
        res.json(savedIncome);
    });
});

incomeRouter.delete('/:income_id/delete', function (req, res) {
    const { income_id } = req.params;

    Income.scope({method: ['userGroup', req.user.current_group_id]})
    .destroy({ where: { id: income_id } })
    .then(() => {
        res.json({ message: 'Income deleted successfully' });
    });
});

export default incomeRouter;
