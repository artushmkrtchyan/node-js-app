const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.query.flash) {
        req.flash('info', 'Flash Message');
    }
    res.render('index', { title: 'Express' });
});

module.exports = router;
