import { Router } from "express";
import ProductsController from "../controllers/ProductsController.js";
import { verifySession } from "../middlewares/verifySession.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const productsController = new ProductsController();
const productsRoutes = Router();

productsRoutes.get("/", verifySession, productsController.getProducts);

productsRoutes.get("/:id", verifySession, productsController.getProductById);

productsRoutes.post(
  "/",
  verifySession,
  verifyAdmin,
  productsController.createProduct
);

productsRoutes.put(
  "/:id",
  verifySession,
  verifyAdmin,
  productsController.updateProduct
);

productsRoutes.delete(
  "/:id",
  verifySession,
  verifyAdmin,
  productsController.deleteProduct
);

export default productsRoutes;
