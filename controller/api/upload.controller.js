const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const upload = require('../../middlewares/uploadMiddleware');
const { createNewFolder } = require('../../lib/utils');

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const uploadPath = `uploads/${year}/${month}`;
const dir = path.join(__dirname, `../../public/${uploadPath}`);

class Upload {
    constructor(name = 'avatar', count = 1) {
        this.name = name;
        this.count = count;
        this.uploadImgs = upload.uploadImages.array(this.name, this.count);

        this.checkImages = async (req, res, next) => {
            await createNewFolder(dir);
            this.uploadImgs(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                        return res.status(400).json({
                            status: 400,
                            message: 'Too many files to upload.',
                        });
                    }
                } else if (err) {
                    next(err);
                }

                next();
            });
        };

        this.saveImages = async (req, res, next) => {
            try {
                if (!req.files) return next();
                req.body[this.name] = [];

                await Promise.all(
                    req.files.map(async (file) => {
                        const filename = file.originalname.replace(/\..+$/, '');
                        const newFilename = `${filename}-${date.getTime()}.jpeg`;

                        await sharp(file.buffer)
                            .resize(640, 320)
                            .toFormat('jpeg')
                            .jpeg({ quality: 90 })
                            .toFile(`${dir}/${newFilename}`);

                        req.body[this.name].push(
                            `${uploadPath}/${newFilename}`
                        );
                    })
                );

                next();
            } catch (e) {
                next(e);
            }
        };

        this.getResult = async (req, res) => {
            if (req.body[this.name].length <= 0) {
                req.flash('error', 'You must select at least 1 image.');
                res.status(400).json({
                    status: 400,
                    message: 'You must select at least 1 image.',
                });
            }

            const images = req.body[this.name]
                .map((image) => '' + image + '')
                .join('');

            req.flash('error', `Images were uploaded:${images}`);
            res.status(400).json({
                status: 400,
                message: `Images were uploaded:${images}`,
            });
        };
    }
}

module.exports = Upload;
