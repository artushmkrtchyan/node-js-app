const models = require('../../models');
const utils = require('../../lib/utils');

exports.createUser = (req, res) => {
    return models.Users.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: utils.generatePassword(req.body.password),
        description: req.body.description || '',
        avatar: req.body.avatar || '',
    }).then(async (user) => {
        user.addRoles(
            await models.Roles.findOne({ where: { name: 'subscriber' } })
        );
        return user;
    });
};

exports.editUser = (req, res) => {
    const user_id = parseInt(req.params.user_id, 10) || 0;
    if (user_id !== 0) {
        models.Users.findByPk(user_id)
            .then((user) => {
                if (user) {
                    if (req.body.avatar && req.body.avatar[0]) {
                        user.avatar = req.body.avatar[0];
                    }
                    user.save()
                        .then((user) => {
                            req.flash('success', 'Updated successful!');
                            res.redirect('back');
                        })
                        .catch((err) => {
                            req.flash('error', err);
                            res.redirect('back');
                        });
                } else {
                    req.flash('info', 'User not found');
                    res.redirect('back');
                }
            })
            .catch((err) => {
                req.flash('error', err);
                res.redirect('back');
            });
    } else {
        req.flash('error', 'Invalid user id');
        res.redirect('back');
    }
};

exports.getUsers = (req, res) => {
    models.Users.findAll()
        .then((users) => res.render('admin/users/index', { users: users }))
        .catch((err) => {
            req.flash('error', err);
            res.redirect('back');
        });
};

exports.getUser = (req, res) => {
    const user_id = parseInt(req.params.user_id, 10) || 0;
    if (user_id !== 0) {
        models.Users.findByPk(req.params.user_id, {
            attributes: {
                exclude: ['password'],
            },
        })
            .then((user) => {
                if (!user) {
                    req.flash('info', 'User not found');
                }
                res.render('admin/users/user', { user: user });
            })
            .catch((err) => {
                req.flash('error', err);
                res.redirect('admin/users');
            });
    } else {
        req.flash('error', 'Invalid user id');
        res.redirect('back');
    }
};

exports.destroyUser = (req, res) => {
    const user_id = parseInt(req.params.user_id, 10) || 0;
    if (user_id !== 0) {
        models.Users.findByPk(req.params.user_id)
            .then((user) => {
                if (user) {
                    user.setRoles([]);
                    return user;
                } else {
                    req.flash('error', 'User not found');
                    res.redirect('back');
                }
            })
            .then((user) => user.destroy())
            .then(res.redirect('admin/users'))
            .catch((err) => {
                req.flash('error', err);
                res.redirect('back');
            });
    } else {
        req.flash('error', 'Invalid user id');
        res.redirect('back');
    }
};

exports.findUser = (username) => {
    return models.Users.findOne({
        where: {
            email: username,
        },
        include: {
            model: models.Roles,
            as: 'Roles',
        },
    });
};
