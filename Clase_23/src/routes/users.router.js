import BaseRouter from "./router.js";

export default class UserRouter extends BaseRouter{
    init(){
        this.get('/', async (req, res) =>{
            res.sendSuccess("Usuario")
        })

        this.get('/aaa', async (req, res) => {
            res.sendSuccessWithPayload({name: "JP", email: "correo@gmail.com"})
        })
    }
}