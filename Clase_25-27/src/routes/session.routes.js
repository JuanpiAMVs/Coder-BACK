import { Router } from "express";
import { passportCall } from "../services/auth.js";
import BaseRouter from "./router.js";
import sessionControllers from "../controllers/session.controllers.js";

/* router.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/registerFail'}), async(req,res) => {
    res.send({status: "succes", message: "Registered"})
})

router.get('/registerFail', async (req, res) => {
    console.log(req.session.messages)
    res.status(400).send({status: "error", error: req.session.messages })
})

router.post('/login', passportCall('login'),  async (req,res) => {
    
    const user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role

    }
   const accessToken = generateToken(user) */
    // Aqui envio el token por el body, para que el front lo guarde
    /* res.send({status: "success", accessToken}); */

    //Envio desde una cookie:
    /* res.cookie('authToken', accessToken, {
        //tiene que coincidir al expiracion con el jswt
        maxAge: 1000*60*60*24,
        httpOnly: true
    }).sendStatus(200)
})


router.post("/logout", async (req, res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).send({status: "error", error: "Error al cerrar sesión"})
        }
        return res.send({status: "success", message: "Session cerrada"})
    })
})

router.get('/github', passport.authenticate('github'), (req, res) => {})

router.get('/githubcallback', passport.authenticate('github'), async (req, res) => {
    const user = req.user */
    //Aqui creo la sesion
/*     req.session.user = {
        id: user.id,
        name: user.first_name,
        role: user.role,
        email: user.email
    }
    res.send({status: "success", message: "Logueado, PERO CON GITHUB"})
})


router.get('/jwtProfile', authToken,async (req, res) => {
    res.send({status: "success", payload: req.user})
}) */

export default class SessionsRouter extends BaseRouter{
    init(){
        this.post('/register',['PUBLIC'],passportCall('register',{strategyType:"locals"}),sessionControllers.registerUser)
        
        this.post('/login',['NO_AUTH'],passportCall('login',{strategyType:"locals"}), sessionControllers.loginUser)

        this.get('/current', ["ADMIN"], passportCall('current', {strategyType:"locals"}), (req, res) => {
            res.sendSuccessWithPayload({user: req.user})
        })
    }
}

/* export default router; */