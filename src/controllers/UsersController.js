import { Role, User } from "../models/index.js";
import bcrypt from "bcrypt";

class UsersController {
  constructor() {}

  getUsers = async (req, res) => {
    try {
      const data = await User.findAll();
      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await User.findByPk(id);
      if (!data) {
        res
          .status(404)
          .send({ success: false, message: "El usuario no existe" });
      } else {
        res.status(200).send({ success: true, message: data });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  createUser = async (req, res) => {
    try {
      const { name, email, password, roleId } = req.body;

      const data = await User.create({
        name,
        email,
        password,
        roleId,
      });

      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { id: reqId, role } = req.user;
      const { name, email, password } = req.body;

      if (reqId !== id && role !== 1) {
        return res.status(404).send({
          success: false,
          message: "No puedes modificar otro usuario.",
        });
      }
      const user = await User.findByPk(id);
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: "El usuario no existe." });
      }

      // if (roleId) {
      //   const existingRole = await Role.findByPk(roleId);
      //   if (!existingRole) {
      //     return res
      //       .status(400)
      //       .send({ success: false, message: "El rol especificado no existe" });
      //   }
      // }

      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;

      await user.validate();
      const passwordHash = await bcrypt.hash(user.password, user.salt);
      user.password = passwordHash;

      await user.save();

      res.status(200).send({
        success: true,
        message: `Se actualizó el usuario ${user.name}.`,
        data: user,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        res.status(400).send({
          success: false,
          message: error.errors[0].message,
        });
      } else {
        res.status(500).send({ success: false, message: error.message });
      }
    }
  };

  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const rowsDeleted = await User.destroy({ where: { id } });

      if (rowsDeleted === 0) {
        res
          .status(404)
          .send({ success: false, message: "El usuario no existe." });
      } else {
        res
          .status(200)
          .send({ success: true, message: "Usuario eliminado correctamente." });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: `Error al eliminar el usuario. ${error.message}`,
      });
    }
  };
}

export default UsersController;
