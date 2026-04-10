import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import models from "#server/models/index.js";
import { knex } from '#server/bd.js'

const { User, Group } = models;

passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    session: true
},
function verify(username, password, cb) {
    knex('user').select('*').where({name: username}).then(async (row) => {
        if (!row || !row[0]) { return cb(null, false, { message: 'Incorrect name or password.' }); }
    
        const hash = row[0].password.replace('$2y$', '$2b$');
        const match = await bcrypt.compare(password, hash);
        if (match) {
            return cb(null, row[0]);
        } else {
            return cb(null, false, { message: 'Incorrect name or password.' });
        }
    }).catch((err) => cb(err));
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, user);
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

const authRouter = express.Router();

authRouter.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info, status) {
        if (err || !user) {
            return res.status(406).json({error: info?.message});
        }
        req.login(user, async function(err) {  // Establish session
            if (err) {
                return res.status(406).json({error: 'Authorization failed'}); 
            }
            const {password, remember_token, ...currentUser} = user;
            const currentGroup = await Group.findByPk(user.current_group_id);
            currentUser.isAdmin = currentGroup.admin_id === user.id;
            res.send({'current-user': currentUser});
        });
    })(req, res, next);
});

authRouter.post('/logout', function (req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.json({ message: 'Logged out successfully' });
    });
});

authRouter.post('/signup', async function(req, res, next) {
    let hash = await bcrypt.hash(req.body.password, 12);
    hash = hash.replace('$2b$', '$2y$');

    try {
        const user = await User.create(
            {
                name: req.body.name,
                password: hash,
                email: '',
                admin_group: [{ name: req.body.name }]
            }, {
                include: [{ model: Group, as: 'admin_group' }]
            }
        );
        const group = user.admin_group[0];
        await user.addGroup(group); // create membership
        user.current_group_id = group.id;
        await user.save();
        //console.log(user);

        req.login(user, function(err) {
            if (err) { return next(err); }
            user.isAdmin = true;
            res.send({'current-user': user});
        });
    } catch (err) {
        return next(err);
    }
});

export default authRouter;
