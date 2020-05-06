const models = require('../../models');
const utils = require('../../lib/utils');

exports.createUser = (req, res) => {
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
            delete user.password;
            return res.status(200).json({ status: 'ok', user });
        })
        .catch((error) => res.status(500).json({ error }));
};

getUsers = (req, res) => {
    models.Users.findAll({
        limit: 10,
        offset: 0,
        include: {
            model: models.Roles,
            as: 'Roles',
        },
        attributes: {
            exclude: ['password'],
        },
    })
        .then((users) => res.status(200).json({ status: 'ok', data: users }))
        .catch((error) => res.status(500).json({ error }));
};

// getUserById = async (req, res) => {
//     const userId = parseInt(req.params.userId) || 0;
//     if (userId !== 0) {
//         try {
//             const user = await models.Users.findByPk(userId);
//             if (user) {
//                 const role = await user.getRoles();
//                 const data = user.toJSON();
//                 delete data.password;
//                 return res
//                     .status(200)
//                     .json({ status: 'ok', data: { ...data, role } });
//             }
//             return res.status(404).json({ message: 'user not found' });
//         } catch (e) {
//             return res.status(500).json({error});
//         }
//     } else {
//         return res.status(400).json({ message: 'Invalid user id.' });
//     }
// };
getUserById = (req, res) => {
    const userId = parseInt(req.params.userId) || 0;
    if (userId !== 0) {
        models.Users.findByPk(userId, {
            include: {
                model: models.Roles,
                as: 'Roles',
            },
            attributes: {
                exclude: ['password'],
            },
        })
            .then((user) => {
                if (user) {
                    return res.status(200).json(user);
                }
                return res.status(404).json({ message: 'user not found' });
            })
            .catch((error) => res.status(500).json({ error }));
    } else {
        return res.status(400).json({ message: 'Invalid user id.' });
    }
};

getUserByName = (req, res) => {
    if (!req.user || !req.user.username)
        return res.status(401).json({ message: 'Unauthorized' });
    models.Users.findOne({
        where: {
            email: req.user.username,
        },
        include: {
            model: models.Roles,
            as: 'Roles',
        },
        attributes: {
            exclude: ['password'],
        },
    })
        .then((user) => {
            if (!user)
                return res.status(401).json({ message: 'Incorrect user name' });
            return res.json({ status: 'ok', user });
        })
        .catch((error) => res.status(500).json({ error }));
};

module.exports = {
    getUsers,
    getUserById,
    getUserByName,
};
