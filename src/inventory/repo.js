const sequelize = require("../../config/database");
const { Inventory, InventoryBatch } = require("../model").inventory;
const { ifEmpty, paginationLinks } = require("../utils");

exports.createStock = async (data) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const inventory = await Inventory.bulkCreate(data, {
        transaction,
        returning: true,
      });

      await InventoryBatch.bulkCreate(
        inventory.map((item) => {
          return {
            inventory_id: item.id,
            operation: "add",
            addedStock: data.find((i) => i.batchNumber === item.batchNumber)
              .stockBalance,
            batchNumber: data.find((i) => i.batchNumber === item.batchNumber)
              .batchNumber,
          };
        }),
        { transaction }
      );

      return true;
    });
  } catch (error) {
    throw error;
  }
};

exports.updateStock = async (data) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const random = Math.floor(Math.random() * 2);
      if (random) {
        // read-modify - Explicit locking
        const inventory = await Inventory.findOne({
          where: {
            isDeleted: false,
            batchNumber: data.batchNumber,
            id: data.id,
          },
          transaction: transaction.LOCK.UPDATE,
        });

        if (!checkIfInventoryExists) {
          throw new Error("Batch number does not exist");
        }

        switch (data.operation) {
          case "add": {
            inventory.update(
              {
                stockBalance: inventory.stockBalance + data.stockBalance,
              },
              {
                transaction,
              }
            );
          }
          case "remove":
          default: {
            inventory.update(
              {
                stockBalance: inventory.stockBalance - data.stockBalance,
              },
              {
                transaction,
              }
            );
          }
        }
      } else {
        // atomic write - cursor stability
        switch (data.operation) {
          case "add": {
            const inventory = await Inventory.increment(
              {
                stockBalance: data.stockBalance,
              },
              {
                where: {
                  batchNumber: data.batchNumber,
                  id: data.id,
                },
                transaction,
              }
            );

            await InventoryBatch.create(
              {
                inventory_id: inventory.id,
                operation: "add",
                addedStock: data.stockBalance,
                batchNumber: data.batchNumber,
              },
              { transaction }
            );

            return inventory;
          }
          case "remove": {
            const inventory = await Inventory.decrement(
              {
                stockBalance: data.stockBalance,
              },
              {
                where: {
                  batchNumber: data.batchNumber,
                  id: data.id,
                },
                transaction,
              }
            );

            await InventoryBatch.create(
              {
                inventory_id: inventory.id,
                operation: "remove",
                removedStock: data.stockBalance,
                batchNumber: data.batchNumber,
              },
              { transaction }
            );
            return inventory;
          }
          default: {
            throw new Error("Invalid operation");
          }
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteStock = async (data) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const inventory = await Inventory.findOne({
        where: {
          batchNumber: data.batchNumber,
          id: data.id,
        },
        transaction,
      });

      if (!checkIfInventoryExists) {
        throw new Error("Batch number does not exist");
      }

      await inventory.update(
        {
          isDeleted: true,
        },
        {
          transaction,
        }
      );
    });
  } catch (error) {
    //handle sequelize error
    throw error;
  }
};

exports.fetchStock = async (data) => {
  try {
    const { pageNo, noOfRows } = data;

    const paginationLimit = ifEmpty(noOfRows) ? null : noOfRows;
    const page = ifEmpty(pageNo) ? null : pageNo;
    let limit = paginationLimit;
    let offset = (page - 1) * limit;

    const [inventory, total] = await Promise.all([
      Inventory.findAll({
        where: {
          isDeleted: false,
        },
        limit: limit,
        offset: offset,
        include: [
          {
            model: InventoryBatch,
          },
        ],
      }),
      Inventory.count({
        where: {
          isDeleted: false,
        },
      }),
    ]);

    const path = `${data.req.protocol}://${data.req.get("host")}${
      data.req.baseUrl
    }${data.req.path}`;
    const currentUrl = `${data.req.protocol}://${data.req.get("host")}${
      data.req.originalUrl
    }`;
    const links = paginationLinks(path, currentUrl, total, page, limit);

    return {
      inventory,
      links,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
