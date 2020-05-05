const multer = require('multer');

const multerStorage = multer.memoryStorage();

const imagesFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('Please upload only images.', false);
    }
};

const uploadImages = multer({
    storage: multerStorage,
    fileFilter: imagesFilter,
    limits: {
        fileSize: 4 * 1024 * 1024,
    },
});

module.exports = {
    uploadImages
};
