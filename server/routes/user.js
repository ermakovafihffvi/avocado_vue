import express from 'express';
import models from "#server/models/index.js";

const { User } = models;

const userRouter = express.Router();

userRouter.get('/current-user', function (req, res, next) {
    User.findByPk(req.user.id)
    .then((user) => {
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    })
    .catch(err => next(err));
});

userRouter.get('/users-list', function (req, res, next) {
    User.scope({method: ['userGroup', req.user.current_group_id]}).findAll()
    .then((users) => {
        res.json(users);
    })
    .catch(err => next(err));   
});

export default userRouter;
