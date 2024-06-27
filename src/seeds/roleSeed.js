import Role from "../models/RolesModels.js";

const roleSeed = async () => {
  const roles = [{ name: "Admin" }, { name: "User" }];

  for (const role of roles) {
    await Role.findOrCreate({
      where: { name: role.name },
      defaults: role,
    });
  }
};

export default roleSeed;
