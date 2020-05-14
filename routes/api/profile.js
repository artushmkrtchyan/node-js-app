const express = require('express');
const app = (module.exports = express());
const AuthMiddleware = require('../../middlewares/authMiddleware');
const UserController = require('../../controller/api/user.controller');

app.use(AuthMiddleware.authenticateToken);
app.get('/', UserController.getUserByName);
