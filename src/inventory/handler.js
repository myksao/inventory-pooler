const repo = require("./repo");
const { createStockQ, updateStockQ } = require("../../config/redis").queue;

exports.createStock = async (req, res) => {
  try {
    const { payload } = req.body;
    // {
    //   payload: [
    //     {
    //       batchNumber: "123",
    //       stockBalance: 10,
    //     },
    //   ];
    // }

    await createStockQ.add(
      "createStock",
      {
        payload,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    );

    //  const data = await createStock({
    //    batchNumber,
    //    stockBalance,
    //  });

    return res.status(201).json({
      success: true,
      message: "Stock created successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { batchNumber, stockBalance, id } = req.body;

    await updateStockQ.add(
      "updateStock",
      {
        batchNumber,
        stockBalance,
        id,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    );

    //    const data = await updateStock({
    //      batchNumber,
    //      stockBalance,
    //      id,
    //    });

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const { batchNumber, id } = req.body;

    const data = await repo.deleteStock({
      batchNumber,
      id,
    });

    return res.status(200).json({
      success: true,
      message: "Stock deleted successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

exports.fetchStock = async (req, res) => {
  try {
    const { batchNumber, id } = req.query;
    const data = await repo.fetchStock({
      batchNumber,
      id,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Stock fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
