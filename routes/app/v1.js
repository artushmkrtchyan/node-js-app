const app = (module.exports = require('../../lib/authenticator'));
const flash = require('express-flash');
app.use(flash());

app.use('/', require('./index'));
app.use('/auth', require('./auth'));
app.use(
    '/profile',
    (req, res, next) => {
        if (!req.user) {
            req.flash('error', 'please login first');
            res.redirect('/auth/login');
        }
        next();
    },
    require('./profile')
);
app.use('/admin', require('./admin/router'));
