const router = require("express").Router();
const {
  createStock,
  deleteStock,
  updateStock,
  fetchStock,
} = require("./handler");
router
  .route("/")
  .post(createStock)
  .patch(updateStock)
  .delete(deleteStock)
  .get(fetchStock);

module.exports = router;
