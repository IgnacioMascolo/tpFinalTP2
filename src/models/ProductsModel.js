import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "El nombre no puede estar vacío.",
        },
        len: {
          args: [3, 30],
          msg: "El nombre debe tener entre 3 y 30 caracteres.",
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: "El stock debe ser un número entero.",
        },
        min: {
          args: [0],
          msg: "El stock no puede ser negativo.",
        },
      },
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isFloat: {
          args: true,
          msg: "El precio debe ser un número decimal.",
        },
        min: {
          args: [0],
          msg: "El precio no puede ser negativo.",
        },
      },
    },
  },
  {
    sequelize: connection,
    modelName: "Product",
  }
);

export default Product;
