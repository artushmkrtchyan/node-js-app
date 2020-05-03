const models = require('../models');

exports.isRoleAdmin = async (req, res, next) => {
    try {
        if(!req.user){
            res.redirect('/auth/login');
        }
        const userId = parseInt(req.user.id, 10) || 0;
        if (userId !== 0) {
            const user = await models.Users.findByPk(userId)
            const role = await user.getRoles()
            const isAdmin = !!role.find(item => item.name === 'admin')
            if(isAdmin) {
                next()
            } else {
                req.flash('info', 'Please login with administrator privileges and try again');
                res.redirect('back');
            }
        } else {
            req.flash('error', 'Invalid user');
            res.redirect('back');
        }
    } catch (err) {
        next(err)
    }
};