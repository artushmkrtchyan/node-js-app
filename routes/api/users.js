const express = require('express');
const router = express.Router();
const UserController = require('../../controller/api/user.controller')
const RoleMiddleware = require('../../middlewares/roleMiddleware');
const ContentTypeMiddleware = require('../../middlewares/contentTypeMiddleware');


router.use(RoleMiddleware.isAdmin)

router.get('/', ContentTypeMiddleware.contentTypeApplicationJson, UserController.getUsers);

router.get('/:userId', ContentTypeMiddleware.contentTypeApplicationJson, UserController.checkUserId, UserController.getUserById);

router.put('/:userId', UserController.checkUserId, UserController.editUser)

router.delete('/:userId', UserController.checkUserId, UserController.deleteUser)

module.exports = router;
