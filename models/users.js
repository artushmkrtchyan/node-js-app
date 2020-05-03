'use strict';
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define(
        'Users',
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate :{
                    isEmail: {
                        msg: "Email is not a valid email."
                    }
                }
            },
            password: DataTypes.STRING,
            description: DataTypes.STRING,
            avatar: DataTypes.STRING,
        },
        {tableName: 'users'}
    );
    Users.associate = (models) => {
        Users.belongsToMany(models.Roles, {
            through: models.UsersRoles,
            as: 'Roles',
            foreignKey: 'user_id',
        });
    };
    return Users;
};
