import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const authController = new AuthController();
const authRoutes = Router();

authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.register);

export default authRoutes;
