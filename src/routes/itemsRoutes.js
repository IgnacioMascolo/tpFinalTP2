import { Router } from "express";
import ItemsController from "../controllers/ItemsController.js";
import { verifySession } from "../middlewares/verifySession.js";
import verifyItem from "../middlewares/verifyItem.js";

const itemsController = new ItemsController();
const itemsRoutes = Router();

itemsRoutes.get("/", verifySession, itemsController.getItems); // Obtener todos los ítems
itemsRoutes.get("/:id", verifySession, verifyItem, itemsController.getItemById); // Obtener un ítem por ID
itemsRoutes.post("/", verifySession, itemsController.createItem); // Crear un nuevo ítem
itemsRoutes.put("/:id", verifySession, verifyItem, itemsController.editItem); // Editar un ítem existente
itemsRoutes.delete(
  "/:id",
  verifySession,
  verifyItem,
  itemsController.deleteItem
); // Eliminar un ítem

export default itemsRoutes;
