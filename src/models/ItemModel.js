import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";
import Product from "./ProductsModel.js";
import User from "./UsersModel.js";
import Pedido from "./PedidoModel.js";
class Item extends Model {}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "El ID del producto debe ser un número entero.",
        },
      },
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "El ID del usuario debe ser un número entero.",
        },
      },
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pedido,
        key: "id",
      },
      validate: {
        isInt: {
          args: true,
          msg: "El ID del pedido debe ser un número entero.",
        },
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: "La cantidad debe ser un número entero.",
        },
        min: {
          args: [1],
          msg: "La cantidad debe ser al menos 1.",
        },
      },
    },
    precioTotal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isFloat: {
          args: true,
          msg: "El precio total debe ser un número decimal.",
        },
        min: {
          args: [0],
          msg: "El precio total no puede ser negativo.",
        },
      },
    },
    completo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: connection,
    modelName: "Item",
    hooks: {
      beforeValidate: async (item) => {
        const product = await Product.findByPk(item.producto_id);
        if (product) {
          item.precioTotal = item.cantidad * product.price;
        } else {
          throw new Error("Producto no encontrado");
        }
      },
    },
  }
);

export default Item;
