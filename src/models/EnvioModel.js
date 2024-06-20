import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";
import PedidoGrande from "./PedidoGrandeModel.js";

class Envios extends Model {}

Envios.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pedidoGrande_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PedidoGrande,
        key: 'id',
      },
      validate: {
        isInt: {
          args: true,
          msg: "El ID del pedido grande debe ser un número entero.",
        },
      },
    },
    fechaEnQueSePidio: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "La fecha en que se pidió debe ser una fecha válida.",
        },
      },
    },
    fechaLlegada: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "La fecha de llegada debe ser una fecha válida.",
        },
      },
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: connection,
    modelName: "Envios",
    hooks: {
      beforeValidate: (envio) => {
        const today = new Date();
        envio.estado = envio.fechaLlegada > today ? "en camino" : "entregado";
      },
    },
  }
);

Envios.belongsTo(PedidoGrande, {
  foreignKey: 'pedidoGrande_id',
});

export default Envios;
