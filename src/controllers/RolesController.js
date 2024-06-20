import { Role } from "../models/index.js";

class RolesController {
  constructor() {}

  getRoles = async (req, res) => {
    try {
      const data = await Role.findAll();
      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  getRoleById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Role.findByPk(id);
      if (!data) {
        res.status(404).send({ success: false, message: "El rol no existe" });
      } else {
        res.status(200).send({ success: true, message: data });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  createRole = async (req, res) => {
    try {
      const { name } = req.body;

      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        res.status(400).send({
          success: false,
          message: "El rol ya existe.",
        });
      } else {
        const data = await Role.create({ name });

        res.status(201).send({ success: true, message: data });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  updateRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const role = await Role.findByPk(id);

      if (!role) {
        return res
          .status(404)
          .send({ success: false, message: "El rol no existe" });
      }

      role.name = name || role.name;

      await role.save();

      res.status(200).send({
        success: true,
        message: `Se actualizó el rol ${role.name}`,
        data: role,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  deleteRole = async (req, res) => {
    try {
      const { id } = req.params;
      const rowsDeleted = await Role.destroy({ where: { id } });

      if (rowsDeleted === 0) {
        return res
          .status(404)
          .send({ success: false, message: "El rol no existe" });
      }

      res
        .status(200)
        .send({ success: true, message: "Rol eliminado correctamente" });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: `Error al eliminar el rol. ${error.message}`,
      });
    }
  };
}

export default RolesController;
