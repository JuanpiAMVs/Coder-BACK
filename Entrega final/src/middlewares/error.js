import EErrors from "../constants/EErrors.js";

export default (err, req, res, next) => { // Este es el que define que NUNCA caiga el server
  res.send({ status: "error", error: err.message });
};
