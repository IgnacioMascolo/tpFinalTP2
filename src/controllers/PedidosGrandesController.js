import Item from "../models/ItemModel.js";
import PedidoGrande from "../models/PedidoGrandeModel.js";
import Pedido from "../models/PedidoModel.js";
import Product from "../models/ProductsModel.js";

class PedidosGrandesController {
  constructor() {}

  getPedidosGrandes = async (req, res) => {
    try {
      const data = await PedidoGrande.findAll({
        include: {
          model: Pedido,
          as: "pedidos",
          include: [
            {
              model: Item,
              include: [
                {
                  model: Product,
                  as: "product",
                },
              ],
            },
          ],
        },
      });
      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  getPedidoGrandeById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await PedidoGrande.findByPk(id, {
        include: { model: Pedido, as: "pedidos" },
      });
      if (!data) {
        res
          .status(404)
          .send({ success: false, message: "El pedido grande no existe" });
      } else {
        res.status(200).send({ success: true, message: data });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  // TODO Chequear, en front no lo usamos
  createPedidoGrande = async (req, res) => {
    try {
      const { pedidos } = req.body;

      let precioTotal = 0;
      let estado = false;
      const montoMinimo = 1000; // Ejemplo de monto mínimo

      for (let pedido of pedidos) {
        const pedidoData = await Pedido.findByPk(pedido.pedido_id);
        if (!pedidoData) {
          return res.status(404).send({
            success: false,
            message: `El pedido con ID ${pedido.pedido_id} no existe`,
          });
        }
        precioTotal += pedidoData.precioTotal;
      }

      if (precioTotal >= montoMinimo) {
        estado = true;
      }

      const pedidoGrande = await PedidoGrande.create({
        precioTotal,
        estado,
      });

      await pedidoGrande.setPedidos(pedidos.map((pedido) => pedido.pedido_id));

      res.status(200).send({ success: true, message: pedidoGrande });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };
  // TODO Chequear, en front no lo usamos
  editPedidoGrande = async (req, res) => {
    try {
      const { id } = req.params;
      const { pedidos } = req.body;

      const pedidoGrande = await PedidoGrande.findByPk(id);
      if (!pedidoGrande) {
        return res
          .status(404)
          .send({ success: false, message: "El pedido grande no existe" });
      }

      let precioTotal = 0;
      let estado = false;
      const montoMinimo = 1000; // Ejemplo de monto mínimo

      for (let pedido of pedidos) {
        const pedidoData = await Pedido.findByPk(pedido.pedido_id);
        if (!pedidoData) {
          return res.status(404).send({
            success: false,
            message: `El pedido con ID ${pedido.pedido_id} no existe`,
          });
        }
        precioTotal += pedidoData.precioTotal;
      }

      if (precioTotal >= montoMinimo) {
        estado = true;
      }

      pedidoGrande.precioTotal = precioTotal;
      pedidoGrande.estado = estado;

      await pedidoGrande.save();

      await pedidoGrande.setPedidos(pedidos.map((pedido) => pedido.pedido_id));

      res.status(200).send({
        success: true,
        message: `Se actualizó el pedido grande ${pedidoGrande.id}`,
        data: pedidoGrande,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };
  // TODO Chequear, en front no lo usamos
  deletePedidoGrande = async (req, res) => {
    try {
      const { id } = req.params;
      const rowsDeleted = await PedidoGrande.destroy({ where: { id } });

      if (rowsDeleted === 0) {
        return res
          .status(404)
          .send({ success: false, message: "El pedido grande no existe" });
      }

      res.status(200).send({
        success: true,
        message: "Pedido grande eliminado correctamente",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error al eliminar el pedido grande",
      });
    }
  };
}

export default PedidosGrandesController;
