import Pedido from "../models/PedidoModel.js";
import Item from "../models/ItemModel.js";
import Product from "../models/ProductsModel.js";
import User from "../models/UsersModel.js";

class PedidosController {
  constructor() {}

  getPedidos = async (req, res) => {
    try {
      const data = await Pedido.findAll({
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
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });
      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  getPedidoById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Pedido.findByPk(id, {
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
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });
      if (!data) {
        res
          .status(404)
          .send({ success: false, message: "El pedido no existe" });
      } else {
        res.status(200).send({ success: true, message: data });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  //TODO Chequear para el tp del back, en front no se usa
  createPedido = async (req, res) => {
    try {
      const { usuario_id, items } = req.body;

      let precioTotal = 0;

      for (let item of items) {
        const itemData = await Item.findByPk(item.item_id);
        if (!itemData) {
          return res.status(404).send({
            success: false,
            message: `El item con ID ${item.item_id} no existe`,
          });
        }
        precioTotal += itemData.precioTotal;
      }

      const pedido = await Pedido.create({
        usuario_id,
        precioTotal,
      });

      await pedido.setItems(items.map((item) => item.item_id));

      res.status(200).send({ success: true, message: pedido });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  //TODO Chequear para el tp del back, en front no se usa
  editPedido = async (req, res) => {
    try {
      const { id } = req.params;
      const { usuario_id, items } = req.body;

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res
          .status(404)
          .send({ success: false, message: "El pedido no existe" });
      }

      let precioTotal = 0;
      for (let item of items) {
        const itemData = await Item.findByPk(item.item_id);
        if (!itemData) {
          return res.status(404).send({
            success: false,
            message: `El item con ID ${item.item_id} no existe`,
          });
        }
        precioTotal += itemData.precioTotal;
      }

      pedido.usuario_id = usuario_id || pedido.usuario_id;
      pedido.precioTotal = precioTotal;

      await pedido.save();

      await pedido.setItems(items.map((item) => item.item_id));

      res.status(200).send({
        success: true,
        message: `Se actualizó el pedido ${pedido.id}`,
        data: pedido,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  //TODO Chequear para el tp del back, en front no se usa
  deletePedido = async (req, res) => {
    try {
      const { id } = req.params;
      const rowsDeleted = await Pedido.destroy({ where: { id } });

      if (rowsDeleted === 0) {
        return res
          .status(404)
          .send({ success: false, message: "El pedido no existe" });
      }

      res
        .status(200)
        .send({ success: true, message: "Pedido eliminado correctamente" });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "Error al eliminar el pedido" });
    }
  };
}

export default PedidosController;
