"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("batch", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      inventory_id: {
        type: Sequelize.UUID,
      },
      operation: {
        type: Sequelize.ENUM("add", "remove"),
      },
      addedStock: {
        type: Sequelize.DECIMAL,
      },
      removedStock: {
        type: Sequelize.DECIMAL,
      },
      batchNumber: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("batch");
  },
};
