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
    //console.log('serializing');
    //console.log(user);
    process.nextTick(function() {
        cb(null, user);
    });
});

passport.deserializeUser(function(user, cb) {
    //console.log('deserializing');
    //console.log(user);
    process.nextTick(function() {
        return cb(null, user);
    });
});

const authRouter = express.Router();

authRouter.post('/login', function (req, res, next) {
    console.log('Attempting login...');
    console.log('Request body:', req.body);
    passport.authenticate('local', function (err, user, info, status) {
        console.log('Authentication result:', { err, user, info, status });
        req.login(user, function(err) {  // Establish session
            if (err) { return next(err); }
            res.send({'current-user': user});
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
                admin: [{
                    name: req.body.name
                }]
            }, {
                include: [{ model: Group, as: 'admin' }]
            }
        );
        user.current_group_id = user.admin[0].id;
        await user.save();
        //console.log(user);

        req.login(user, function(err) {
            if (err) { return next(err); }
            res.send({'current-user': user});
        });
    } catch (err) {
        console.log(err);
        return next(err);
    }
});

export default authRouter;
