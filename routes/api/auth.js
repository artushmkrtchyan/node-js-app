const express = require('express');
const app = (module.exports = express());
const AuthController = require('../../controller/api/auth.controller');

app.post('/login', AuthController.login);
