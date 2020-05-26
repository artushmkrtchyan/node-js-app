const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const io = require('socket.io')();
const app = express();
app.io = io;

if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log(' * * * STARTING * * * \n\n');

//add socket.io in request
app.use(function (req, res, next) {
    req.io = app.io;
    next();
});

// API routes - versioned!
const API_VERSIONS = ['v1'];
API_VERSIONS.map((version) => {
    app.use(`/api/${version}/`, require(`./routes/api/${version}`));
});

// app routes!
app.use('/', require('./routes/app/v1'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    const error = {
        message: err.message,
        error: {},
    };
    // development error handler
    if (app.get('env') === 'development') {
        error.error = err;
    }

    if (req.path && req.path.indexOf('/api/') !== -1) {
        res.json(error);
    } else {
        res.render('error', error);
    }
});

module.exports = app;
