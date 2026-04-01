import express from 'express';
import models from "#server/models/index.js";

const { CategoryExpense } = models;

const expenseCategoryRouter = express.Router();

expenseCategoryRouter.delete('/:category_id/delete', function (req, res, next) {
    CategoryExpense.scope({method: ['userGroup', req.user.current_group_id]}).destroy({
        where: { id: req.params.category_id }
    })
    .then(() => {
        res.json(null);
    })
    .catch(err => next(err));
});

expenseCategoryRouter.put('/:category_id/update', async function (req, res, next) {
    const category = await CategoryExpense.scope({method: ['userGroup', req.user.current_group_id]}).findByPk(req.params.category_id);

    await category.update({
        [req.body.field]: req.body.value.trim()
    })
    .catch(err => next(err));

    return res.json(category);
});

expenseCategoryRouter.post('/add', function (req, res, next) {
    CategoryExpense.create({
        title: req.body.title.trim(),
        group_id: req.user.current_group_id,
        str_id: req.body.str_id.trim(),
        limit: req.body.limit,
        isActive: req.body.isActive,
        currency_id: req.body.currency_id,
        desc: req.body.desc.trim(),
        special: req.body.special
    })
    .then((category) => {
        res.json(category);
    })
    .catch((err) => {
        next(err)
    });
});

export default expenseCategoryRouter;
