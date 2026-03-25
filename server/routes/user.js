import express from 'express';
import models from "#server/models/index.js";

const { User } = models;

const userRouter = express.Router();

userRouter.get('/current-user', function (req, res) {
    User.findByPk(req.user.id)
    .then((user) => {
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

userRouter.get('/users-list', function (req, res) {
    User.scope({method: ['userGroup', req.user.current_group_id]}).findAll()
    .then((users) => {
        res.json(users);
    });   
});

export default userRouter;
