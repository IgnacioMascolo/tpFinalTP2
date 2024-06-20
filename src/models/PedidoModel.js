import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

import User from "./UsersModel.js";

class Pedido extends Model {}

Pedido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    modelName: "Pedido",
  }
);

export default Pedido;
