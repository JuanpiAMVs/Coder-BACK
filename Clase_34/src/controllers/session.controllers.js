import {generateToken} from '../services/auth.js'

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
          res.send({ status: "success", payload: user });
    }
    catch(error){
        console.log(error)
         return res.sendBadRequest(error)
    }
}

const logOut = async (req, res) => {
    res.clearCookie("authToken");
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


export default{
    registerUser,
    loginUser,
    githubCallback
}