import { Router } from "express";
import PedidosGrandesController from "../controllers/PedidosGrandesController.js";

const pedidosGrandesController = new PedidosGrandesController();
const pedidosGrandesRoutes = Router();

pedidosGrandesRoutes.get("/", pedidosGrandesController.getPedidosGrandes);

pedidosGrandesRoutes.get("/:id", pedidosGrandesController.getPedidoGrandeById);

pedidosGrandesRoutes.post("/", pedidosGrandesController.createPedidoGrande);

pedidosGrandesRoutes.put("/:id", pedidosGrandesController.editPedidoGrande);

pedidosGrandesRoutes.delete("/:id", pedidosGrandesController.deletePedidoGrande);

export default pedidosGrandesRoutes;
