import { Role, User } from "../models/index.js";
import { generateToken } from "../utils/token.js";

class AuthController {
  constructor() {}

  register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "El correo electrónico ya está en uso.",
        });
      }

      await User.create({
        name,
        email,
        password,
      });

      res
        .status(201)
        .json({ success: true, message: "Usuario registrado exitosamente." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: "role" }],
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "El usuario no existe." });
      }

      const isPasswordValid = await user.passwordValidation(password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ success: false, message: "Credenciales inválidas." });
      }

      const token = generateToken({
        id: user.id,
        name: user.name,
        role: user.roleId,
      });

      res.status(200).json({ success: true, user, token });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default AuthController;
