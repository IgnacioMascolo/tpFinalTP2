import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT;
const SECRET = process.env.SECRET;

export { PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT, SECRET };
