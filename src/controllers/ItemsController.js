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

      // Chequeo del stock antes de proceder
      if (product.stock < cantidad) {
        return res.status(400).send({
          success: false,
          message: `No hay suficiente stock. Stock disponible: ${product.stock}`,
        });
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

      // Reducir el stock después de la creación del ítem
      product.stock -= cantidad;
      await product.save();

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
      const previousCantidad = item.cantidad;

      let product = await Product.findByPk(item.producto_id);

      // Chequeo del stock antes de proceder
      if (product.stock + previousCantidad < cantidad) {
        return res.status(400).send({
          success: false,
          message: `No hay suficiente stock. Stock disponible: ${product.stock + previousCantidad}`,
        });
      }

      if (cantidad) {
        item.cantidad = cantidad;
        item.precioTotal = product.price * cantidad;
      }

      await item.save();

      // Ajustar el stock después de la edición del ítem
      product.stock = product.stock + previousCantidad - cantidad;
      await product.save();

      const pedido = await Pedido.findByPk(item.pedido_id);
      const pedidoPreviousTotal = pedido.precioTotal;
      pedido.precioTotal += item.precioTotal - previousTotal;

      await pedido.save();

      const pedidoGrande = await PedidoGrande.findByPk(pedido.pedido_grande_id);
      pedidoGrande.precioTotal += item.precioTotal - previousTotal;
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
      const previousCantidad = item.cantidad;

      const pedido = await Pedido.findByPk(item.pedido_id);
      if (!pedido) {
        return res
          .status(404)
          .send({ success: false, message: "El pedido no existe" });
      }

      const product = await Product.findByPk(item.producto_id);

      await item.destroy();

      // Ajustar el stock después de eliminar el ítem
      product.stock += previousCantidad;
      await product.save();

      pedido.precioTotal -= previousItemPrice;
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
