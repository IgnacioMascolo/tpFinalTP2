import Role from "./RolesModels.js";
import User from "./UsersModel.js";
import Product from "./ProductsModel.js";
import Item from "./ItemModel.js";
import Pedido from "./PedidoModel.js";
import PedidoGrande from "./PedidoGrandeModel.js";

Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

User.hasMany(Item, { foreignKey: "usuario_id" });
Item.belongsTo(User, { foreignKey: "usuario_id" });

User.hasMany(Pedido, { foreignKey: "usuario_id" });
Pedido.belongsTo(User, { foreignKey: "usuario_id" });

Pedido.hasMany(Item, { foreignKey: "pedido_id" });
Item.belongsTo(Pedido, { foreignKey: "pedido_id" });

Item.belongsTo(Product, {
  foreignKey: "producto_id",
  as: "product",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.hasMany(Item, {
  foreignKey: "producto_id",
  as: "items",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

PedidoGrande.hasMany(Pedido, {
  foreignKey: "pedido_grande_id",
  as: "pedidos",
});
Pedido.belongsTo(PedidoGrande, {
  foreignKey: "pedido_grande_id",
});

export { Role, User, Product, Item, Pedido };
