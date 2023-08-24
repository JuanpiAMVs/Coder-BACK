import jwt from "jsonwebtoken";

const restoreRequestView = async (req, res) => {
    try {
        res.render('restoreRequest')
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const getRestorePasswordView = async (req, res) => {
    const { token } = req.query;
    try {
      const validToken = jwt.verify(token,"jwtSecret");
      res.render("restorePassword");
    } catch (error) {
      return res.render('invalidToken')
    }

  };

  const restorePassword = (req, res) => {
    res.render('restorePassword')
  }



  export default {
    getRestorePasswordView,
    restorePassword,
    restoreRequestView
  };