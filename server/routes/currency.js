import express from 'express';
import models from "#server/models/index.js";

const { Currency } = models;

const currencyRouter = express.Router();

currencyRouter.get('/currencies', function (req, res, next) {
    Currency.scope({method: ['userGroup', req.user.current_group_id]}).findAll()
    .then((currencies) => {
        res.json(currencies);
    });
});

currencyRouter.post('/add-currency', function (req, res, next) {
    const { title, str_id, rate } = req.body;
    Currency.create({
        title,
        str_id,
        rate,
        group_id: req.user.current_group_id
    })
    .then((currency) => {
        res.json(currency);
    });
});

currencyRouter.post('/:currency_id/set-rate', function (req, res, next) {
    const { rate } = req.body;
    const { currency_id } = req.params;

    Currency.scope({method: ['userGroup', req.user.current_group_id]})
    .update({ rate }, { where: { id: currency_id } })
    .then(() => {
        res.json({ message: 'Rate updated successfully' });
    });
});

export default currencyRouter;
