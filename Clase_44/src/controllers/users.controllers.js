import ErrorService from "../services/ErrorService.js";
import { userServices } from "../services/services.js";

export const createUser = async (req, res) => {
    try{
        const user = req.body
        const createUser = await userServices.createUser(user)
        return res.sendSuccess({user})
    }catch(err){
        ErrorService.createError({
            name: "User creation error",
            cause: err
        })
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

export const changeRole = async (req, res) => {
    try{
        const {uid}= req.params
        const getUser = await userServices.getUserBy({uid})
        if(getUser.documents.length === 3){
            if(getUser.role == "USER") getUser.role = "PREMIUM"
            if(getUser.role == "PREMIUM") getUser.role = "USER"
        }else{
            return res.sendBadRequest("No has cargado los documentos de verificación.")
        }      
        const change = await userServices.updateUser(uid, getUser)
        return res.sendSuccess({payload: change})
    }catch(error){
        return res.sendBadRequest(error)
    }
}

export const uploadFiles = async (req, res) => {
    try{
        const {files} = req;
        const {uid}= req.params
        const user = await userServices.getUserBy({_id: uid})
        if(!user) return  res.sendBadRequest("Usuario no encontrado")

        const documents = user.documents || [];
        const requiredReferences = [
          "Identificación",
          "Comprobante de domicilio",
          "Comprobante de estado de cuenta",
        ];
        files.forEach((file, index) => {
          const reference =
            index < requiredReferences.length
              ? requiredReferences[index]
              : file.originalname;
          documents.push({ name: file.originalname, reference: reference });
        });

        // Verificar si se han cargado los tres documentos requeridos
        const uploadedReferences = documents.map((doc) => doc.reference);
        const hasRequiredDocuments = requiredReferences.every((docRef) =>
        uploadedReferences.includes(docRef)
        );

        // Actualizar el estado del usuario si se han cargado los tres documentos
        if (hasRequiredDocuments) {
        user.status = true;
        }

        // Actualizando el usuario en la base de datos con el nuevo array "documents"
        const updatedUser = await userServices.updateUser({_id:uid}, {
            documents,
            status: user.status,
        });
        console.log(updateUser)
        const newUser = await userServices.getUserBy({_id: uid});

        res.sendSuccessWithPayload({ newUser });

    }catch(err){
        return res.sendBadRequest(err)
    }
}

export default{
    createUser,
    getUserBy,
    getUsers,
    updateUser,
    deleteUser,
    changeRole,
    uploadFiles
}
