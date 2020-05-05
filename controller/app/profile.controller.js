const models = require('../../models');

exports.editProfile = (req, res) => {
    const userId = parseInt(req.user.id) || 0;
    if (userId !== 0) {
        models.Users.findByPk(userId)
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

exports.destroyProfile = (req, res) => {
    const userId = parseInt(req.user.id) || 0;
    if (userId !== 0) {
        models.Users.findByPk(userId)
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
            .then(res.redirect('/'))
            .catch((err) => {
                req.flash('error', err);
                res.redirect('back');
            });
    } else {
        req.flash('error', 'Invalid user id');
        res.redirect('back');
    }
};
