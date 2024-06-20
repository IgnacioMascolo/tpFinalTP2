import { Router } from "express";
import EnviosController from "../controllers/EnviosController.js";

const enviosController = new EnviosController();
const enviosRoutes = Router();

enviosRoutes.get("/", enviosController.getEnvios);

enviosRoutes.get("/:id", enviosController.getEnvioById);

enviosRoutes.post("/", enviosController.createEnvio);

enviosRoutes.put("/:id", enviosController.editEnvio);

enviosRoutes.delete("/:id", enviosController.deleteEnvio);

export default enviosRoutes;
