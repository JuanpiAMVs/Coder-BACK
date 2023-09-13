import {generateToken, validatePassword, createHash} from '../services/auth.js'
import MailingService from '../services/mail.service.js'
import { userServices } from '../services/services.js'
import RestoreTokenDTO from '../DTO/RestoreTokenDTO.js'
import DTemplates from '../constants/DTemplates.js'
import jwt  from 'jsonwebtoken'
import config from '../config/config.js'

const registerUser = async (req,res)=>{
    try{
        return res.sendSuccess({message:`Usuario ${req.user.name} registrado`})
       }
       catch(error){
        return res.sendBadRequest(error)
       }

}


const loginUser = async (req,res)=>{
    try{     
        const user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart,
          };
          const accessToken = generateToken(user);
          res.cookie("authToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
          }); 
              const currentTime = new Date().toISOString(); 
              const userConnection = await userServices.updateUser(user.id, { last_connection: currentTime }, { new: true });
              
          res.send({ status: "success", payload: user });
    }
    catch(error){
         return res.sendBadRequest(error)
    }
}

const logOut = async (req, res) => {
    res.clearCookie("authToken");
    const currentTime = new Date().toISOString(); 
    const userConnection = await userServices.updateUser(user.id, { last_connection: currentTime }, { new: true });
    res.send({ status: "success", message: "Log out" });
  };


const githubCallback = (req, res) => {
    const user = {
      id: req.user._id,
      name: req.user.first_name,
      email: req.user.email,
      role: req.user.role,
    };
    const accessToken = generateToken(user);
  
    res.cookie("authToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.redirect("/");
  };

  const restoreRequest=async(req,res)=>{
    try{
      const {email}= req.body
      if(!email) return res.sendBadRequest("No se proporcionó un email")
      const user= await userServices.getUserBy({email})
    console.log(user)
      if(user){
       const restoreToken= generateToken(RestoreTokenDTO.getFrom(user), 60*60)
       const mailingService= new MailingService()
      const result= await mailingService.sendMail(user.email, DTemplates.RESTORE,{restoreToken})
      console.log(result)
      res.sendSuccess({message:`Correo enviado a ${email}`})
      }
      if(!user){
       res.sendBadRequest({error: "Email no valido"})
      }
    }catch(error){
      console.log(error)
    }

  }

  const restorePassword = async (req, res) => {
    const { password, token } = req.body;
    try {
      const tokenUser = jwt.verify(token, config.JWT_SECRET);
      console.log(tokenUser);
      const user = await userServices.getUserBy({email: tokenUser.email});
      if (!user)
      return res.status(400).send({ status: "error", error: "Usuario no encontrado" });
      //verificar si la clave no es la misma
      const isSamePassword = await validatePassword(password, user.password);
      console.log(isSamePassword);
      if (isSamePassword) return res.sendBadRequest("Su contraseña es la misma");
      const newHassedPassword = await createHash(password);
      console.log(newHassedPassword);
      await userServices.updateUser(user._id, { password: newHassedPassword });
      res.sendSuccess("Contraseña cambiada");
    } catch (error) {
      console.log(error);
    }
  }


export default{
    registerUser,
    loginUser,
    githubCallback,
    logOut,
    restoreRequest,
    restorePassword
}