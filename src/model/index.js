const InventoryBatch = require("./batch");
const Inventory = require("./inventory");

Inventory.hasMany(InventoryBatch, {
  foreignKey: "inventory_id",
  onDelete: "CASCADE",
});

InventoryBatch.belongsTo(Inventory, {
  foreignKey: "inventory_id",
  onDelete: "CASCADE",
});

module.exports = {
  inventory: {
    Inventory,
    InventoryBatch,
  },
};
