import EErrors from "../constants/EErrors.js";

export default (err, req, res, next) => { // Este es el que define que NUNCA caiga el server
  res.status(err.status).send({ status: "error", error: err.message });
};