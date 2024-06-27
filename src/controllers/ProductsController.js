import PedidoGrande from "../models/PedidoGrandeModel.js";
import { Item, Pedido, Product } from "../models/index.js";

class ProductsController {
  constructor() {}

  getProducts = async (req, res) => {
    try {
      const data = await Product.findAll();
      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Product.findByPk(id);
      if (!data) {
        res
          .status(404)
          .send({ success: false, message: "El producto no existe" });
      } else {
        res.status(200).send({ success: true, message: data });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  createProduct = async (req, res) => {
    try {
      const { name, stock, price } = req.body;
      const data = await Product.create({
        name,
        stock,
        price,
      });
      res.status(200).send({ success: true, message: data });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, stock, price } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res
          .status(404)
          .send({ success: false, message: "El producto no existe" });
      }

      product.name = name || product.name;
      product.stock = stock || product.stock;
      product.price = price || product.price;

      await product.save();

      product.name = name || product.name;
      product.stock = stock || product.stock;
      product.price = price || product.price;

      await product.save();

      const items = await Item.findAll({ where: { producto_id: id } });

      for (const item of items) {
        const previousTotal = item.precioTotal;
        item.precioTotal = item.cantidad * product.price;
        await item.save();

        const pedido = await Pedido.findByPk(item.pedido_id);
        if (pedido) {
          pedido.precioTotal += item.precioTotal - previousTotal;
          await pedido.save();

          const pedidoGrande = await PedidoGrande.findByPk(
            pedido.pedido_grande_id
          );
          if (pedidoGrande) {
            pedidoGrande.precioTotal += item.precioTotal - previousTotal;
            await pedidoGrande.save();
          }
        }
      }

      res.status(200).send({
        success: true,
        message: `Se actualizó el producto ${product.name}`,
        data: product,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;

      // Encuentra todos los items asociados con el producto
      const items = await Item.findAll({ where: { producto_id: id } });

      for (const item of items) {
        const pedido = await Pedido.findByPk(item.pedido_id);
        if (pedido) {
          pedido.precioTotal -= item.precioTotal;
          await pedido.save();

          const pedidoGrande = await PedidoGrande.findByPk(
            pedido.pedido_grande_id
          );
          if (pedidoGrande) {
            pedidoGrande.precioTotal -= item.precioTotal;
            await pedidoGrande.save();
          }
        }

        await item.destroy(); // Elimina el item
      }

      const rowsDeleted = await Product.destroy({ where: { id } });

      if (rowsDeleted === 0) {
        return res
          .status(404)
          .send({ success: false, message: "El producto no existe" });
      }

      res
        .status(200)
        .send({ success: true, message: "Producto eliminado correctamente" });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: `Error al eliminar el producto. ${error.message}`,
      });
    }
  };
}

export default ProductsController;
