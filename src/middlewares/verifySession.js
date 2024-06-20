import { decodeToken } from "../utils/token.js";

export const verifySession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("El token no ha sido enviado");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Token no válido");
    }

    const { id, name, role } = decodeToken(token);
    req.user = { id, name, role };

    next();
  } catch (error) {
    res
      .status(401)
      .send({ success: false, message: error.message || "Token no válido" });
  }
};
