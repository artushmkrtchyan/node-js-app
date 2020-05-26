const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            req.io.emit('chat message', msg);
        });
    });
    res.sendFile('chat.html', { root: 'public/html' });
});

module.exports = router;
