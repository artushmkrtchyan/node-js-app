const express = require('express');
const app = (module.exports = express());
const passport = require('passport');

app.get('/login', function (req, res, next) {
    return res.render('auth/login');
});

// app.post(
//     '/login',
//     passport.authenticate('local-login', {
//         successRedirect: '/',
//         failureRedirect: '/auth/login',
//         failureFlash: true,
//         successFlash: 'Welcome!'
//     })
// );

app.post(
    '/login',
    passport.authenticate('local-login', {
        failureRedirect: '/auth/login',
        failureFlash: true,
        successFlash: 'Welcome!',
    }),
    function(req, res) {
        if(req.user.Roles && !!req.user.Roles.find(item => item.name === 'admin')){
            res.redirect('/admin');
        }
        res.redirect('/');
    }
);

app.get('/register', function (req, res, next) {
    return res.render('auth/register');
});

app.post(
    '/register',
    passport.authenticate('local-register', {
        successRedirect: '/',
        failureRedirect: '/auth/register',
        failureFlash: true,
    })
);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
