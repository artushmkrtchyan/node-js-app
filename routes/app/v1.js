const app = (module.exports = require('../../lib/authenticator'));
const flash = require('express-flash');
app.use(flash());

app.use('/', require('./index'));
app.use('/auth', require('./auth'));
app.use('/profile', require('./profile'));
app.use('/admin', require('./admin/router'));
