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
        const accessToken = generateToken(req.user);

        res.cookie('authToken',accessToken, {
            maxAge:1000*60*60*24,
             httpOnly:true,
        })
        .sendSuccess("Logged In")
    }
    catch(error){
         return res.sendBadRequest(error)
    }
}


export default{
    registerUser,
    loginUser
}