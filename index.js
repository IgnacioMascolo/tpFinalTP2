import cors from "cors";
import express from "express";
import router from "./src/routes/router.js";
import connection from "./src/connection/connection.js";
import { notFound } from "./src/middlewares/notFound.js";
import { log } from "./src/middlewares/log.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(log);

app.use(router);

app.use(notFound);

await connection.sync({ alter: true });

app.listen(8080, () => {
  console.log("server ok");
});
