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


const authRouter = express.Router();

authRouter.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info, status) {
        res.send({'current-user': user});
    })(req, res, next);
});

export default authRouter;
