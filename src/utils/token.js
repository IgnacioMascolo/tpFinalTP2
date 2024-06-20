import jwt from "jsonwebtoken";
import { SECRET } from "../config/config.js";

export const generateToken = (payload) => {
  const token = jwt.sign(payload, SECRET, { expiresIn: "2d" });
  return token;
};

export const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (error) {
    throw new Error(`Token inválido. ${error.message}`);
  }
};
