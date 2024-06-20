import { Router } from "express";
import RolesController from "../controllers/RolesController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifySession } from "../middlewares/verifySession.js";

const rolesController = new RolesController();
const rolesRoutes = Router();

rolesRoutes.get("/", rolesController.getRoles);

rolesRoutes.get("/:id", verifySession, rolesController.getRoleById);

rolesRoutes.post("/", rolesController.createRole);

rolesRoutes.put("/:id", verifySession, verifyAdmin, rolesController.updateRole);

rolesRoutes.delete(
  "/:id",
  verifySession,
  verifyAdmin,
  rolesController.deleteRole
);

export default rolesRoutes;
