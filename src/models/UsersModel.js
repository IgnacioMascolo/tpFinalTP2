import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import connection from "../connection/connection.js";

class User extends Model {
  passwordValidation = async (password) => {
    const validation = await bcrypt.compare(password, this.password);
    return validation;
  };
}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "El nombre no puede ser nulo.",
        },
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
      validate: {
        notNull: {
          args: true,
          msg: "El email no puede ser nulo.",
        },
        isEmail: {
          args: true,
          msg: "El correo electrónico debe ser válido.",
        },
      },
    },
    salt: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "La contraseña no puede ser nula.",
        },
        len: {
          args: [8, undefined],
          msg: "La contraseña debe tener al menos 8 caracteres.",
        },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          msg: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.",
        },
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      references: {
        model: "Roles",
        key: "id",
      },
    },
  },
  {
    sequelize: connection,
    modelName: "User",
  }
);

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt();
  user.salt = salt;
  const passwordHash = await bcrypt.hash(user.password, salt);
  user.password = passwordHash;
});

export default User;
