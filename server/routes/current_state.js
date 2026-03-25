import express from 'express';
import models from "#server/models/index.js";

const { CurrentStateCategory, CurrentState } = models;

const currentStateRouter = express.Router();

currentStateRouter.get('/categories', function (req, res) {
    CurrentStateCategory.scope({method: ['userGroup', req.user.current_group_id]}).findAll({
        paranoid: true
    })
    .then((categories) => {
        res.json(categories);
    });
});

currentStateRouter.delete('/category/:category_id/delete', function (req, res) {
    CurrentStateCategory.scope({method: ['userGroup', req.user.current_group_id]}).destroy({
        where: { id: req.params.category_id }
    })
    .then(() => {
        res.json(null);
    });
});

currentStateRouter.put('/category/:category_id/update', async function (req, res) {
    const category = await CurrentStateCategory.scope({method: ['userGroup', req.user.current_group_id]})
        .update({
            [req.body.field]: req.body.value.trim()
        }, {
            where: { id: req.params.category_id }   
        });
    res.json(category);
});

currentStateRouter.post('/category/add', function (req, res) {
    CurrentStateCategory.create({
        title: req.body.title.trim(),
        group_id: req.user.current_group_id,
        str_id: req.body.str_id.trim(),
        currency_id: req.body.currency,
        desc: req.body.desc.trim()
    })
    .then((category) => {
        res.json(category);
    });
});

currentStateRouter.post('/update', async function (req, res) {
    const [state, created] = await CurrentState.upsert({
        user_id: req.body.user_id,
        category_id: req.body.category_id,
        pseudo_month: req.body.pseudo_month,
        sum: req.body.sum,
        group_id: req.user.current_group_id
    });

    return res.json(state);
});

export default currentStateRouter;
