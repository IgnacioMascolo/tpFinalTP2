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

}

export default PedidosGrandesController;
