"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "admin",
          description: "Admin User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "editor",
          description: "Editor User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "subscriber",
          description: "Subscriber User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
