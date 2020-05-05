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
        .catch((error) => res.status(500).json({ error }));
};

module.exports = {
    login,
};
