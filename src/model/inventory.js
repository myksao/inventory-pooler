const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Inventory = sequelize.define("inventory", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  batchNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  stockBalance: {
    type: DataTypes.DECIMAL,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
}, {
    tableName: 'inventory'
});

module.exports = Inventory;
