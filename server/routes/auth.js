import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    session: false
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
        cb(null, { id: user.id, username: user.name });
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
        res.send({'current-user': user});
    })(req, res, next);
});

authRouter.post('/signup', async function(req, res, next) {
    let hash = await bcrypt.hash(req.body.password, 12);
    hash = hash.replace('$2b$', '$2y$');

    try {
        await knex.insert({
            name: req.body.name,
            password: hash,
            email: ''
        }).into('user');

        const userCreated = await knex('user').select('*').where({
            name: req.body.name
        }).limit(1);
        const user = {
            id: userCreated[0].id,
            username: userCreated[0].name
        };
        req.login(user, function(err) {
            if (err) { return next(err); }
            res.send({'current-user': userCreated});
        });
    } catch (err) {
        return next(err);
    }
});

export default authRouter;
