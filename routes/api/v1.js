const express = require('express')
const app = module.exports = express()
const AuthMiddleware = require('../../middlewares/authMiddleware');

app.use('/', require('./index'))
app.use('/auth', require('./auth'))
app.use('/users', AuthMiddleware.authenticateToken, require('./users'))
app.use('/profile', require('./profile'))
