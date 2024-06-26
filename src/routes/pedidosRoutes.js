import { Router } from "express";
import PedidosController from "../controllers/PedidosController.js";
import { verifySession } from "../middlewares/verifySession.js";

const pedidosController = new PedidosController();
const pedidosRoutes = Router();

pedidosRoutes.get("/", verifySession, pedidosController.getPedidos);

pedidosRoutes.get("/:id", verifySession, pedidosController.getPedidoById);

// pedidosRoutes.post("/", verifySession, pedidosController.createPedido);

// pedidosRoutes.put("/:id", verifySession, pedidosController.editPedido);

// pedidosRoutes.delete("/:id", verifySession, pedidosController.deletePedido);

export default pedidosRoutes;
