const models = require('../../models');
const utils = require('../../lib/utils');

checkUserId = (req, res, next) => {
    const userId = parseInt(req.params.userId, 10) || 0;
    if (userId !== 0) {
        next();
    } else {
        return res
            .status(400)
            .json({ status: 400, message: 'Invalid user id' });
    }
};

createUser = (req, res) => {
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

editUser = (req, res) => {
    models.Users.findByPk(req.params.userId)
        .then((user) => {
            if (user) {
                if (req.body.avatar && req.body.avatar[0]) {
                    user.avatar = req.body.avatar[0];
                }
                if (req.body.firstName) {
                    user.firstName = req.body.firstName;
                }
                if (req.body.lastName) {
                    user.lastName = req.body.lastName;
                }
                if (req.body.description) {
                    user.description = req.body.description;
                }
                user.save()
                    .then((data) => {
                        const user = data.toJSON();
                        delete user.password;
                        return res.status(200).json({ status: 'ok', user });
                    })
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res
                    .status(404)
                    .json({ status: 404, message: 'User not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

deleteUser = (req, res) => {
    models.Users.findByPk(req.params.userId)
        .then((user) => {
            if (user) {
                user.setRoles([]);
                return user;
            } else {
                return res
                    .status(404)
                    .json({ status: 'ok', message: 'User not found' });
            }
        })
        .then((user) => user.destroy())
        .then(() => {
            return res.status(200).json({ status: 'ok', message: 'Deleted' });
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
//     try {
//         const user = await models.Users.findByPk(req.params.userId);
//         if (user) {
//             const role = await user.getRoles();
//             const data = user.toJSON();
//             delete data.password;
//             return res
//                 .status(200)
//                 .json({ status: 'ok', data: { ...data, role } });
//         }
//         return res.status(404).json({ message: 'user not found' });
//     } catch (e) {
//         return res.status(500).json({error});
//     }
// };
getUserById = (req, res) => {
    models.Users.findByPk(req.params.userId, {
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
            return res.status(404).json({ status: 404, message: 'user not found' });
        })
        .catch((error) => res.status(500).json({ error }));
};

getUserByName = (req, res) => {
    if (!req.user || !req.user.username)
        return res.status(401).json({ status: 401, message: 'Unauthorized' });
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
                return res
                    .status(401)
                    .json({ status: 401, message: 'Incorrect user name' });
            return res.json({ status: 'ok', user });
        })
        .catch((error) => res.status(500).json({ error }));
};

module.exports = {
    checkUserId,
    createUser,
    editUser,
    deleteUser,
    getUsers,
    getUserById,
    getUserByName,
};
