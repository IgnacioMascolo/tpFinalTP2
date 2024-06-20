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


}

export default PedidosController;
