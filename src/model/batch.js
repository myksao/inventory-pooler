const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const InventoryBatch = sequelize.define("batch", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  inventory_id: {
    type: DataTypes.UUID,
  },
  operation: {
    type: DataTypes.ENUM("add", "remove"),
  },
  addedStock: {
    type: DataTypes.DECIMAL,
  },
  removedStock: {
    type: DataTypes.DECIMAL,
  },
  batchNumber: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
}, {
    tableName: 'batch'
});

module.exports = InventoryBatch;
