const models = require('../../models');
const utils = require('../../lib/utils');

getUsers = (req, res) => {
    models.Users.findAll({
        limit: 10,
        offset: 0,
        attributes: {
            exclude: ['password'],
        },
    })
        .then((users) => res.status(200).json({ status: 'ok', data: users }))
        .catch((e) => res.status(500).json(e));
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
//             return res.status(500).json(e);
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
            .catch((e) => res.status(500).json({ message: e }));
    } else {
        return res.status(400).json({ message: 'Invalid user id.' });
    }
};

module.exports = {
    getUsers,
    getUserById,
};
