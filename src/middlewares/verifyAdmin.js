export const verifyAdmin = (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== 1) {
      throw new Error("Acceso denegado. Debes ser administrador.");
    }

    next();
  } catch (error) {
    res.status(403).send({ success: false, message: error.message });
  }
};
