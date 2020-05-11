const express = require('express');
const router = express.Router();
const UserController = require('../../controller/api/user.controller')
const RoleMiddleware = require('../../middlewares/roleMiddleware');


router.use(RoleMiddleware.isAdmin)

router.get('/', UserController.getUsers);

router.get('/:userId', UserController.checkUserId, UserController.getUserById);

router.put('/:userId', UserController.checkUserId, UserController.editUser)

router.delete('/:userId', UserController.checkUserId, UserController.deleteUser)

module.exports = router;
