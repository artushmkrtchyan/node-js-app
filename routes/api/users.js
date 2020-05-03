const express = require('express');
const router = express.Router();
const models = require('../../models/index');
const UserController = require('../../controller/api/user.controller')

/* GET users listing. */
router.get('/', UserController.getUsers);

/* GET SINGLE user info. */
router.get('/:userId', UserController.getUserById);

module.exports = router;
