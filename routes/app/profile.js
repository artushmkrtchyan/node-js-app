const express = require('express');
const router = express.Router();
const Upload = require('../../controller/app/upload.controller');
const ProfileController = require('../../controller/app/profile.controller');

const UploadController = new Upload('avatar', 1);

router.get('/', (req, res, next) => {
    res.render('profile');
});

router.post(
    '/',
    UploadController.uploadImages,
    UploadController.resizeImages,
    ProfileController.editProfile
);

module.exports = router;
