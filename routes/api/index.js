const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
    res.json({
        status: 'ok',
        data: 'start api'
    })
})

module.exports = router
