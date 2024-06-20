import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

class PedidoGrande extends Model {}

PedidoGrande.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  },
  {
    sequelize: connection,
    modelName: "PedidoGrande",
  }
);

export default PedidoGrande;
