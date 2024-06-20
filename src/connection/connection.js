import { Sequelize } from "sequelize";
import {
  DB_NAME,
  DB_DIALECT,
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
} from "../config/config.js";

const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

try {
  await connection.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default connection;
