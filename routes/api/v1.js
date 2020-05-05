const express = require('express')
const app = module.exports = express()

app.use('/', require('./index'))
app.use('/auth', require('./auth'))
app.use('/users', require('./users'))
app.use('/profile', require('./profile'))
