import { Router } from "express";
import userModel from '../dao/mongo/models/user.model.js'

const router = Router()

router.post('/register', async(req,res) => {
    const result = await userModel.create(req.body)     //Suponiendo que envio todo bien
    console.log(req.body)
    res.send({status: "succes", payload :result})
})

router.post('/login', async (req,res) => {
 const {email, password} = req.body;
     // buscar el usuario
    const user = await userModel.findOne({email, password});
    if(!user) return res.status(400).send({status: "error", error: "Usuario o contraseña incorrecta"})

    // si existe el usuario crear sesion

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
    }

    res.send({status: "success"});
})
export default router;