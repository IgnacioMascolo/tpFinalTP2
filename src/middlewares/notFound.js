export const notFound = (req, res, next) => {
  res.status(404).send({ success: false, message: "La ruta no existe" });
  next();
};
