import cors from "cors";
import express from "express";
import router from "./src/routes/router.js";
import connection from "./src/connection/connection.js";
import { notFound } from "./src/middlewares/notFound.js";
import roleSeed from "./src/seeds/roleSeed.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(notFound);

await connection.sync({ alter: true });
await roleSeed();

app.listen(8080, () => {
  console.log("server ok");
});
