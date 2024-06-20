import Envios from "../models/EnvioModel.js";
import PedidoGrande from "../models/PedidoGrandeModel.js";

class EnviosController {
  constructor() {}

  getEnvios = async (req, res) => {
    try {
      const data = await Envios.findAll({ include: PedidoGrande });
      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  getEnvioById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Envios.findByPk(id, { include: PedidoGrande });
      if (!data) {
        res.status(404).send({ success: false, message: "El envío no existe" });
      } else {
        res.status(200).send({ success: true, message: data });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  createEnvio = async (req, res) => {
    try {
      const { pedidoGrande_id, fechaEnQueSePidio, fechaLlegada } = req.body;

      const envio = await Envios.create({
        pedidoGrande_id,
        fechaEnQueSePidio,
        fechaLlegada,
      });

      res.status(200).send({ success: true, message: envio });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  editEnvio = async (req, res) => {
    try {
      const { id } = req.params;
      const { pedidoGrande_id, fechaEnQueSePidio, fechaLlegada } = req.body;

      const envio = await Envios.findByPk(id);
      if (!envio) {
        return res.status(404).send({ success: false, message: "El envío no existe" });
      }

      envio.pedidoGrande_id = pedidoGrande_id || envio.pedidoGrande_id;
      envio.fechaEnQueSePidio = fechaEnQueSePidio || envio.fechaEnQueSePidio;
      envio.fechaLlegada = fechaLlegada || envio.fechaLlegada;
      envio.estado = envio.fechaLlegada > new Date() ? "en camino" : "entregado";

      await envio.save();

      res.status(200).send({
        success: true,
        message: `Se actualizó el envío ${envio.id}`,
        data: envio,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  deleteEnvio = async (req, res) => {
    try {
      const { id } = req.params;
      const rowsDeleted = await Envios.destroy({ where: { id } });

      if (rowsDeleted === 0) {
        return res.status(404).send({ success: false, message: "El envío no existe" });
      }

      res.status(200).send({ success: true, message: "Envío eliminado correctamente" });
    } catch (error) {
      res.status(500).send({ success: false, message: "Error al eliminar el envío" });
    }
  };
}

export default EnviosController;
