const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const upload = require('../../middlewares/uploadMiddleware');
const { createNewFolder } = require('../../lib/utils');

class Upload {
    constructor(name, count) {
        this.name = name;
        this.count = count || 10;
        this.uploadFiles = upload.array(this.name, this.count);

        this.uploadImages = (req, res, next) => {
            this.uploadFiles(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                        return res.send('Too many files to upload.');
                    }
                } else if (err) {
                    return res.send(err);
                }

                next();
            });
        };

        this.resizeImages = async (req, res, next) => {
            try {
                if (!req.files) return next();
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth();

                const dir = path.join(
                    __dirname,
                    `../public/uploads/${year}/${month}`
                );
                req.body[this.name] = [];

                await createNewFolder(dir);

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
                            `uploads/${year}/${month}/${newFilename}`
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
                res.redirect('back');
            }

            const images = req.body[this.name]
                .map((image) => '' + image + '')
                .join('');

            req.flash('error', `Images were uploaded:${images}`);
            res.redirect('back');
        };
    }
}

module.exports = Upload;
