import Role from "../models/RolesModels.js";

const roleSeed = async () => {
  await Role.bulkCreate([
    {
      name: "Admin",
    },
    { name: "User" },
  ]);
};

export default roleSeed;
