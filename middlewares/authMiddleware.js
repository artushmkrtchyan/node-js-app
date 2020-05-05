const jwt = require('jsonwebtoken');

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
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};
