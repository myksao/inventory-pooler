require("dotenv").config();
const config = require("./app");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "postgres",
    raw: true,
    port: config.port,
    seederStorage: config.SEEDER_STORAGE,
    // logging: false,
    pool: {
      max: 500,
      min: 0,
      acquire: 200000,
      idle: 200000,
    },
  }
); // Example for postgres

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
