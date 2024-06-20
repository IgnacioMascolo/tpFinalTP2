import Item from "../models/ItemModel.js";
import PedidoGrande from "../models/PedidoGrandeModel.js";
import Pedido from "../models/PedidoModel.js";
import Product from "../models/ProductsModel.js";

class ItemController {
  constructor() {}

  getItems = async (req, res) => {
    try {
      const items = await Item.findAll({
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      });
      res.status(200).send({ success: true, message: items });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  getItemById = async (req, res) => {
    try {
      const data = req.item;
      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  createItem = async (req, res) => {
    try {
      const { producto_id, cantidad } = req.body;
      const { id: usuario_id } = req.user;

      const product = await Product.findByPk(producto_id);
      if (!product) {
        return res
          .status(404)
          .send({ success: false, message: "El producto no existe" });
      }

      let pedido = await Pedido.findOne({
        where: { usuario_id, completo: false },
      });

      let pedidoGrande = await PedidoGrande.findOne({
        where: { estado: false },
      });
      if (!pedidoGrande) {
        pedidoGrande = await PedidoGrande.create({
          estado: false,
          precioTotal: 0,
        });
      }

      if (!pedido) {
        pedido = await Pedido.create({
          pedido_grande_id: pedidoGrande.id,
          usuario_id,
          precioTotal: 0,
        });
      }

      const data = await Item.create({
        producto_id,
        usuario_id,
        cantidad,
        pedido_id: pedido.id,
        precioTotal: product.price * cantidad,
      });

      pedido.precioTotal += data.precioTotal;
      await pedido.save();

      pedidoGrande.precioTotal += data.precioTotal;
      await pedidoGrande.save();

      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  editItem = async (req, res) => {
    try {
      const { cantidad } = req.body;
      const item = req.item;

      const previousTotal = item.precioTotal;
      let product;

      if (cantidad) {
        item.cantidad = cantidad;

        product = await Product.findByPk(item.producto_id);
        item.precioTotal = product.price * cantidad;
      }

      await item.save();

      const pedido = await Pedido.findByPk(item.pedido_id);
      const pedidoPreviousTotal = pedido.precioTotal;
      pedido.precioTotal += item.precioTotal - previousTotal;

      await pedido.save();

      const pedidoGrande = await PedidoGrande.findByPk(pedido.pedido_grande_id);
      pedidoGrande.precioTotal += pedido.precioTotal - pedidoPreviousTotal;
      await pedidoGrande.save();

      res.status(200).send({
        success: true,
        message: `Se actualizó el item ${product.name}`,
        data: item,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  deleteItem = async (req, res) => {
    try {
      const item = req.item;

      const previousItemPrice = item.precioTotal;

      const pedido = await Pedido.findByPk(item.pedido_id);
      if (!pedido) {
        return res
          .status(404)
          .send({ success: false, message: "El pedido no existe" });
      }

      pedido.precioTotal -= previousItemPrice;

      await item.destroy();

      await pedido.save();

      const pedidoGrande = await PedidoGrande.findByPk(pedido.pedido_grande_id);
      pedidoGrande.precioTotal -= previousItemPrice;
      await pedidoGrande.save();

      res
        .status(200)
        .send({ success: true, message: "Item eliminado correctamente" });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "Error al eliminar el item" });
    }
  };
}

export default ItemController;
