import { Router } from "express";
import usersRoutes from "./usersRoutes.js";
import productsRoutes from "./productsRoutes.js";
import rolesRoutes from "./rolesRoutes.js";
import authRoutes from "./authRoutes.js";
import itemsRoutes from "./itemsRoutes.js";
import pedidosRoutes from "./pedidosRoutes.js";
import pedidosGrandesRoutes from "./pedidosGrandesRoutes.js";
import enviosRoutes from "./enviosRoutes.js";

const router = Router();

router.use("/users", usersRoutes);
router.use("/products", productsRoutes);
router.use("/roles", rolesRoutes);
router.use("/auth", authRoutes);
router.use("/items", itemsRoutes);
router.use("/pedidos", pedidosRoutes);
router.use("/pedidos-grandes", pedidosGrandesRoutes);
router.use("/envios", enviosRoutes);

export default router;
