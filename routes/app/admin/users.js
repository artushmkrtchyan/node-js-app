const express = require('express');
const router = express.Router();
const usersController = require('../../../controller/app/user.controller');
const Upload = require('../../../controller/app/upload.controller');

const uploadController = new Upload('avatar', 1);

/* GET users listing. */
router.get('/', usersController.getUsers);

/* User destroy */
router.post('/:user_id/delete', usersController.destroyUser);

/* User edit */
router.post(
    '/:user_id/edit',
    uploadController.uploadImages,
    uploadController.resizeImages,
    usersController.editUser
);

router.post(
    '/upload',
    uploadController.uploadImages,
    uploadController.resizeImages,
    (req, res, next) => {
        console.log('req.body.images: ::;;', req.body.avatar);
        res.redirect('/users');
    }
);

/* GET SINGLE user info. */
router.get('/:user_id', usersController.getUser);

module.exports = router;
