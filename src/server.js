require("dotenv").config();
require("./cron")
const sequelize = require("../config/database");
const express = require("express");
const inventoryRouter = require("./inventory/routes");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/inventory", inventoryRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;