import Item from "../models/ItemModel.js";
import Product from "../models/ProductsModel.js";

const verifyItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const item = await Item.findByPk(id, {
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });
    if (!item) {
      return res
        .status(404)
        .send({ success: false, message: "El item no existe" });
    }

    if (item.usuario_id !== userId && userRole !== 1) {
      return res
        .status(403)
        .send({ success: false, message: "No tienes permiso para  este item" });
    }

    req.item = item;
    next();
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export default verifyItem;
