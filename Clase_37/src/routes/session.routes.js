import { passportCall } from "../services/auth.js";
import BaseRouter from "./router.js";
import sessionControllers from "../controllers/session.controllers.js";
import viewsControllers from "../controllers/views.controllers.js";


export default class SessionsRouter extends BaseRouter{
    init(){
        this.post('/register',['PUBLIC'],passportCall('register',{strategyType:"locals"}),sessionControllers.registerUser)
        
        this.post('/login',['PUBLIC'],passportCall('login',{strategyType:"locals"}), sessionControllers.loginUser)

        this.get('/current', ["ADMIN"], passportCall('current', {strategyType:"locals"}), (req, res) => {
            res.sendSuccessWithPayload({user: req.user})
        })
        this.get("/github", ['PUBLIC'],passportCall("github"), (req, res) => {});

        this.get("/githubcallback",['PUBLIC'], passportCall("github"),sessionControllers.githubCallback);

        this.post('/restoreRequest', ['PUBLIC'], sessionControllers.restoreRequest)

        this.post('/restorePassword', ['NO_AUTH'], sessionControllers.restorePassword)

    }
}

/* export default router; */