const express = require('express');
const app = (module.exports = express());
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const models = require('../models');
const utils = require('../lib/utils');
const usersController = require('../controller/app/user.controller');

// Session!
const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'A!S1312VV31S@2123908jslKDJ)',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
};
// Enable Redis session only in production
if (app.get('env') !== 'development') {
    const RedisStore = require('connect-redis')(session);
    const RedisConnections = require('../lib/redis');
    sessionOptions.store = new RedisStore({ client: RedisConnections.redis });
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    models.Users.findByPk(id)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err);
        });
});

// passport.use(new FacebookStrategy({
//         clientID: config.FACEBOOK_APP_ID,
//         clientSecret: config.FACEBOOK_APP_SECRET,
//         callbackURL: config.protocol + '://' + config.host + '/auth/facebook/callback'
//     },
//     function (accessToken, refreshToken, profile, done) {
//         const fb_link = 'https://www.facebook.com/app_scoped_user_id/' + profile.id + '/'
//         models.user.findOne({
//             where: {
//                 fb_link
//             }
//         }).then(user => {
//             if (user) {
//                 return user
//             } else {
//                 const dName = profile.displayName || ''
//                 return models.user.create({
//                     fb_link,
//                     fb_connect: 1,
//                     first_name: dName.substr(0, dName.indexOf(' ')),
//                     last_name: dName.substr(dName.indexOf(' ') + 1),
//                     email: profile.email || ''
//                 })
//             }
//         }).then(user => {
//             done(null, user)
//         }).catch(err => {
//             done(err)
//         })
//     }
// ))

passport.use(
    'local-login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        function (username, password, done) {
            if (!utils.isValidateEmail(username)) {
                return done(null, false, {
                    message: 'Email is not a valid email.',
                });
            }

            usersController
                .findUser(username)
                .then((user) => {
                    if (!user) {
                        return done(null, false, {
                            message: 'Incorrect email.',
                        });
                    }

                    if (!utils.checkPassword(password, user.password)) {
                        return done(null, false, {
                            message: 'Incorrect password.',
                        });
                    }

                    return done(null, user);
                })
                .catch((err) => {
                    done(err);
                });
        }
    )
);

passport.use(
    'local-register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function (req, username, password, done) {
            if (!utils.isValidateEmail(username)) {
                return done(null, false, {
                    message: 'Email is not a valid email.',
                });
            }

            if (!utils.validatePassword(password)) {
                return done(null, false, {
                    message:
                        'Input Password and Submit 5 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter',
                });
            }

            usersController
                .findUser(username)
                .then((user) => {
                    if (user) {
                        return done(null, false, {
                            message: username + ' email already exists.',
                        });
                    }

                    usersController
                        .createUser(req)
                        .then((user) => done(null, user))
                        .catch((err) => done(null, false, { message: err }));
                })
                .catch((err) => {
                    done(err);
                });
        }
    )
);

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use('*', function (req, res, next) {
    if (req.user) {
        res.locals.currentUser = req.user;
    }
    next();
});
