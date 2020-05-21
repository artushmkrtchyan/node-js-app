const express = require('express');
const router = express.Router();
const path = require('path');

// router.get('/', (req, res) => {
//     res.sendFile(path.join(process.cwd() + '/public/index.html'));
// });

router.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public/html' });
});

module.exports = router;
