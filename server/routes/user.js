import express from 'express';
import bcrypt from 'bcrypt';
import models from "#server/models/index.js";
import { isAdminCheck } from '#server/middleware/isAdminCheck.js';

const { User } = models;

const userRouter = express.Router();

userRouter.get('/current-user', function (req, res, next) {
    User.findByPk(req.user.id, { include: 'admin_group' })
    .then((user) => {
        if (user) {
            user.isAdmin = user.admin_group[0]?.id == user.current_group_id; 
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    })
    .catch(err => next(err));
});

userRouter.get('/users-list', async (req, res, next) => {
    if (req.query.deleted) {
        await isAdminCheck(req, res, next);
    } else {
        next();
    }
},
function (req, res, next) {
    User.scope([
        'defaultScope',
        { method: ['userGroup', req.user.current_group_id] }
    ]).findAll({
        include: 'admin_group',
        paranoid: req.query.deleted != 'true'
    })
    .then((users) => {
        res.json(users);
    })
    .catch(err => next(err));   
});

userRouter.post('/add-users', isAdminCheck, async function (req, res, next) {
    try {
        const usersData = req.body?.map((user) => {
            let password = bcrypt.hashSync(user.password, 12);
            password = password.replace('$2y$', '$2b$');
            return {
                name: user.name,
                password: password,
                current_group_id: req.user.current_group_id,
            };
        });
        const users = await User.bulkCreate(usersData);
        users.forEach(element => {
            element.addGroup(req.user.current_group_id);
        });
        res.json(null);
    } catch (err) {
        next(err);
    }
});

userRouter.post('/update-user', isAdminCheck, async function (req, res, next) {
    try {
        if (req.body.password) {
            let hash = await bcrypt.hash(req.body.password, 12);
            hash = hash.replace('$2b$', '$2y$');
            
            await User.scope({ method: ['userGroup', req.user.current_group_id] })
            .update({password: hash}, {
                where: {
                    id: req.body.userId
                }
            });
        }
        if (req.body.isActive === false) {
            await User.scope({ method: ['userGroup', req.user.current_group_id] }).destroy({
                where: {
                    id: req.body.userId
                }
            });
        }
        if (req.body.isActive === true) {
            await User.scope({ method: ['userGroup', req.user.current_group_id] }).restore({
                where: {
                    id: req.body.userId
                }
            });
        }

        res.json(null);
    } catch (err) {
        next(err);
    }
});

userRouter.post('/me/update', async function (req, res, next) {
    try {
        let hash = await bcrypt.hash(req.body.password, 12);
        hash = hash.replace('$2b$', '$2y$');

        const user = await User.findByPk(req.user.id);
        user.password = hash;
        await user.save();
        return res.json(null);
    } catch (err) {
        next(err);
    }
});

export default userRouter;
