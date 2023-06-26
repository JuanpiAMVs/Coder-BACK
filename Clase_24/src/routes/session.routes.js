import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'

import { passportCall } from "../services/auth.js";
import { authToken } from "../middlewares/jwtAuth.js";
import BaseRouter from "./router.js";
import { generateToken } from "../services/auth.js";

const router = Router()

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
        this.post('/register',['NO_AUTH'],passportCall('register',{strategyType:"locals"}),(req,res)=>{
            res.sendSuccess()
        })
        
        this.post('/login',['NO_AUTH'],passportCall('login',{strategyType:"locals"}),(req,res)=>{
            const token = generateToken(req.user);
            res.cookie('authToken',token,{
                maxAge:1000*3600*24,
                httpOnly:true
            }).sendSuccess("Logged In")
        })

        this.get('/current', ["ADMIN"], passportCall('current', {strategyType:"locals"}), (req, res) => {
            res.sendSuccessWithPayload({user: req.user})
        })
    }
}

/* export default router; */