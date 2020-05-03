const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.query.flash) {
        req.flash('info', 'Flash Message');
    }
    res.render('index', { title: 'Admin Panel' });
});

module.exports = router;
