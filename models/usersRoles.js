'use strict';
module.exports = (sequelize, DataTypes) => {
    const UsersRoles = sequelize.define(
        'UsersRoles',
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        { tableName: 'users_roles' }
    );
    UsersRoles.associate = (models) => {}
    return UsersRoles;
};
