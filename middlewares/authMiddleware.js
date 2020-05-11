const jwt = require('jsonwebtoken');
const models = require('../models');
const utils = require('../lib/utils');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'testSecret';

exports.generateAccessToken = (username) => {
    return jwt.sign(username, accessTokenSecret, { expiresIn: 5 * 60 * 60 });
};

exports.authenticateToken = (req, res, next) => {
    const { authorization } = req.headers;
    const token =
        authorization && authorization.split(' ')[0] === 'Bearer'
            ? authorization.split(' ')[1]
            : null;
    if (!token)
        return res.status(401).json({ status: 401, message: 'Unauthorized' });

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err)
            return res.status(403).json({ status: 403, message: 'Forbidden' });
        req.user = user;
        next();
    });
};

exports.register = async (req, res, next) => {
    const errors = [];
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            status: 400,
            message: 'firstName, lastName, email, password is required',
        });
    }

    if (!utils.isValidateEmail(email)) {
        errors.push({ status: 422, message: 'Email is not a valid email.' });
    }
    if (confirmPassword !== password) {
        errors.push({
            status: 226,
            message: 'Password and password confirmation do not match.',
        });
    }
    if (!utils.validatePassword(password)) {
        errors.push({
            status: 225,
            message:
                'Input Password and Submit 5 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter.',
        });
    }
    if (errors.length) {
        return res.status(422).json({ errors });
    }
    try {
        const user = await models.Users.findOne({ where: { email } });
        if (user) {
            return res
                .status(422)
                .json({ status: 409, message: 'Email already exists.' });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
    next();
};
