import express from 'express';
import models from "#server/models/index.js";

const { CurrentStateCategory, CurrentState } = models;

const currentStateRouter = express.Router();

currentStateRouter.get('/categories', function (req, res, next) {
    CurrentStateCategory.scope({method: ['userGroup', req.user.current_group_id]}).findAll({
        paranoid: true
    })
    .then((categories) => {
        res.json(categories);
    })
    .catch(err => next(err));
});

currentStateRouter.delete('/category/:category_id/delete', function (req, res, next) {
    CurrentStateCategory.scope({method: ['userGroup', req.user.current_group_id]}).destroy({
        where: { id: req.params.category_id }
    })
    .then(() => {
        res.json(null);
    })
    .catch(err => next(err));
});

currentStateRouter.put('/category/:category_id/update', async function (req, res, next) {
    const category = await CurrentStateCategory.scope({method: ['userGroup', req.user.current_group_id]})
        .update({
            [req.body.field]: req.body.value.trim()
        }, {
            where: { id: req.params.category_id }   
        })
        .catch(err => next(err));
    res.json(category);
});

currentStateRouter.post('/category/add', function (req, res, next) {
    CurrentStateCategory.create({
        title: req.body.title.trim(),
        group_id: req.user.current_group_id,
        str_id: req.body.str_id.trim(),
        currency_id: req.body.currency,
        desc: req.body.desc.trim()
    })
    .then((category) => {
        res.json(category);
    })
    .catch(err => next(err));
});

currentStateRouter.post('/update', async function (req, res, next) {
    try {
        const [state, created] = await CurrentState.findOrCreate({
            where: {
                user_id: req.body.user_id,
                category_id: req.body.category_id,
                pseudo_month: req.body.pseudo_month,
                group_id: req.user.current_group_id
            }
        });
        state.sum = req.body.sum;
        state.save();
        return res.json(state);
    } catch(err) {
        next(err)
    }
});

export default currentStateRouter;
