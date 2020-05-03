const express = require('express')
const app = module.exports = express()

app.use('/', require('./index'))
app.use('/users', require('./users'))