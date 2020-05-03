const express = require('express');
const app = (module.exports = express());
const flash = require('express-flash');
const roleMiddleware = require('../../../middlewares/roleMiddleware')
app.use(flash());

app.use(roleMiddleware.isRoleAdmin);

app.use('/', require('./index'));
app.use('/users', require('./users'));
