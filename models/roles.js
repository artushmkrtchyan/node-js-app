"use strict";
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define(
    "Roles",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: DataTypes.STRING,
    },
      {tableName: 'roles'}
  );
  Roles.associate = (models) => {
    Roles.belongsToMany(models.Users, {
      through: models.UsersRoles,
      as: "Users",
      foreignKey: "role_id",
    });
  };
  return Roles;
};
