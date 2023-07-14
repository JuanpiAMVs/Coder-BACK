import { userServices } from "../services/services.js";

export const createUser = async (req, res) => {
    try{
        const user = req.body
        const createUser = userServices.createUser(user)
        return res.sendSuccess({user})
    }catch(err){
        return res.sendBadRequest(err)
    }
}

export const getUsers = async (req, res) => {
    try{
        const users = await userServices.getUsers()
        return res.sendSuccess({payload:users})
     }
     catch(error){
         return res.sendBadRequest(error)
    }
}

export const getUserBy = async (req, res) => {
    try{
        const params = req.params
        const user = await userServices.getUserBy(params)
        return res.sendSuccess({user})
    }catch(err){
        return res.sendBadRequest(err)
    }
}

export const updateUser = async (req,res)=>{
    try{
        const {uid}= req.user._id
        const user= req.body
        const newUser= await userServices.updateUser(uid,user)
        return res.sendSuccess({payload: newUser})
        }
        catch(error){
            return res.sendBadRequest(error)
        }
}

export const deleteUser = async (req,res)=>{
    try{
        const uid= req.user._id
        
        const result= await userServices.deleteUser(uid)
        return res.sendSuccess({message: `Se eliminó ${result.first_name}`})
        }
        catch(error){
            return res.sendBadRequest(error)
        }
}

export default{
    createUser,
    getUserBy,
    getUsers,
    updateUser,
    deleteUser
}
