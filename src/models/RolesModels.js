import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

class Role extends Model {}

Role.init(
  {
    name: {
      type: DataTypes.ENUM("User", "Admin"),
      allowNull: false,
      defaultValue: "User",
      // unique: true,
      validate: {
        isIn: {
          args: [["User", "Admin"]],
          msg: "El rol debe ser 'User' o 'Admin'.",
        },
      },
    },
  },
  {
    sequelize: connection,
    modelName: "Role",
  }
);

export default Role;
