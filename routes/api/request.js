const express = require('express');
const router = (module.exports = express.Router());
const url = require('url');

router.get('/jsonplaceholder/users', (req, res) => {
    fetch('https://jsonplaceholder.typicode.com/users') //global.fetch
        .then((response) => response.json())
        .then((data) => res.json({ status: 'ok', data }));
});

router.get('/jsonplaceholder/posts', (req, res) => {
    fetch(
        `https://jsonplaceholder.typicode.com/posts${
            url.parse(req.url, true).search
        }`
    ) //global.fetch
        .then((response) => response.json())
        .then((data) => res.json({ status: 'ok', data }));
});

router.get('/jsonplaceholder/photos', (req, res) => {
    const query = url.parse(req.url, true).query;
    const { offset = 0, limit = 10 } = query;
    fetch(
        `https://jsonplaceholder.typicode.com/photos?_start=${offset}&_limit=${limit}`
    ) //global.fetch
        .then((response) => response.json())
        .then((data) => res.json({ status: 'ok', data }));
});
