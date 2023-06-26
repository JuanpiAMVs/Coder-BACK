import { Router } from "express";
import jwt from 'jsonwebtoken'

export default class BaseRouter {

    constructor(){
        this.router = Router()
        this.init()
    }

    getRouter(){ // Simplemente para poder acceder al router de Express  desde fuera
        return this.router
    }
    init() {} // Este no nos interesa ahora, pero le interesara a nuestros hijos(clases)

    get(path,policies, ...callbacks){
        this.router.get(path,this.generateCustomResponses,this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    post(path,policies, ...callbacks){
        this.router.post(path,this.generateCustomResponses, this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }

    put(path, policies,...callbacks){
        this.router.put(path,this.generateCustomResponses,this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    delete(path,policies, ...callbacks){
        this.router.delete(path,this.generateCustomResponses,this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = message => res.send({status: "success", message})
        res.sendSuccessWithPayload = payload => res.send({status: "success", payload})
        next()
    }

    handlePolicies = policies => {
        //policies contendra todos los roles que puedan entrar
        return (req, res, next) => {
            if(policies[0] === "PUBLIC") return next()
            const authHeaders = req.headers.authorization;
            if(!authHeaders) return res.status(401).send({status: "error", error: "Unauthorized"})
            const token = authHeaders.split(" ")[1];
            const user = jwt.verify(token, 'tokenSecret')
            //En este punto ya tendria al usuario

            // Si NO esta incluido el rol del usuario.
            if(!policies.includes(user.role.toUpperCase())) res.status(403).send({status: "error", error: "Forbidden"})
            req.user = user
            next()
        }}

    

    applyCallbacks(callbacks){
        return callbacks.map(callback => async(...params) => {
            try{
                await callback.apply(this, params)
            }catch(error){
                (req, res, next)
                params[1].status(500).send(error)
            }
        } )
    }
}