const express = require('express');
const app = (module.exports = express());
const AuthController = require('../../controller/api/auth.controller');
const AuthMiddleware = require('../../middlewares/authMiddleware');

app.post('/login', AuthController.login);

app.post('/register', AuthMiddleware.register, AuthController.register);
