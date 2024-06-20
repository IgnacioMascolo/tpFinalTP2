import { Router } from "express";
import UsersController from "../controllers/UsersController.js";
import { verifySession } from "../middlewares/verifySession.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const usersController = new UsersController();
const usersRoutes = Router();

usersRoutes.get("/", usersController.getUsers);

usersRoutes.get(
  "/:id",
  usersController.getUserById
);

usersRoutes.post("/", usersController.createUser);

usersRoutes.put("/:id", verifySession, usersController.updateUser);

usersRoutes.delete(
  "/:id",
  verifySession,
  verifyAdmin,
  usersController.deleteUser
);

export default usersRoutes;
