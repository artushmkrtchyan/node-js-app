const express = require('express');
const router = express.Router();
const UserController = require('../../controller/api/user.controller');
const RoleMiddleware = require('../../middlewares/roleMiddleware');
const ContentTypeMiddleware = require('../../middlewares/contentTypeMiddleware');
const Upload = require('../../controller/api/upload.controller');
const UploadController = new Upload();

router.use(RoleMiddleware.isAdmin);

router.get(
    '/',
    ContentTypeMiddleware.contentTypeApplicationJson,
    UserController.getUsers
);

router.get(
    '/:userId',
    ContentTypeMiddleware.contentTypeApplicationJson,
    UserController.checkUserId,
    UserController.getUserById
);

router.put(
    '/:userId',
    ContentTypeMiddleware.contentTypeFormData,
    UserController.checkUserId,
    UploadController.checkImages,
    UploadController.saveImages,
    UserController.editUser
);

router.delete(
    '/:userId',
    UserController.checkUserId,
    UserController.deleteUser
);

module.exports = router;
