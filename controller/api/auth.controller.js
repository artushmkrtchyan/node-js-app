const models = require('../../models');
const utils = require('../../lib/utils');
const AuthMiddleware = require('../../middlewares/authMiddleware');

login = (req, res, next) => {
    const { username, password } = req.body;
    if (!utils.isValidateEmail(username)) {
        return res.status(401).json({ message: 'Email is not a valid email.' });
    }
    models.Users.findOne({
        where: {
            email: username,
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: 'Incorrect user name' });
            }

            if (!utils.checkPassword(password, user.password)) {
                return res.status(401).json({ message: 'Incorrect password.' });
            }

            const { firstName, lastName } = user;
            const token = AuthMiddleware.generateAccessToken({
                username,
                firstName,
                lastName,
            });
            res.json({ token });
        })
        .catch((error) => next(error));
};

register = (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        description = '',
        avatar = '',
    } = req.body;
    return models.Users.create({
        firstName,
        lastName,
        email,
        password: utils.generatePassword(password),
        description,
        avatar,
    })
        .then(async (user) => {
            user.addRoles(
                await models.Roles.findOne({ where: { name: 'subscriber' } })
            );

            const token = AuthMiddleware.generateAccessToken({
                username: email,
                firstName,
                lastName,
            });
            res.json({ token });
        })
        .catch((error) => next(error));
};

module.exports = {
    login,
    register,
};
