import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils";
import { authToken } from "../middlewares/jwtAuth";

const router = Router()

router.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/registerFail'}), async(req,res) => {
    res.send({status: "succes", message: "Registered"})
})

router.get('/registerFail', async (req, res) => {
    console.log(req.session.messages)
    res.status(400).send({status: "error", error: req.session.messages })
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/loginFail'}),  async (req,res) => {
    req.session.user = {
        name: req.user.name,
        role: req.user.role,
        email: req.user.email
    }
    res.send({status: "success"});
})


router.get('/loginFail', async (req, res) => {
    console.log(req.session);
    res.status(400).send({status: "error", error: req.session.messages});
});

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
    const user = req.user
    //Aqui creo la sesion
    req.session.user = {
        id: user.id,
        name: user.first_name,
        role: user.role,
        email: user.email
    }
    res.send({status: "success", message: "Logueado, PERO CON GITHUB"})
})

router.post('/jwtLogin', async (req, res) => {
    const {email, password} = req.body
    let accessToken
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        const user = {
            id: 0,
            name: `Admin`,
            email: "...",
            role: "admin"
        }
        //Adios a sesssion, genero token
         accessToken = generateToken(user)
        res.send({status: "success", accessToken: accessToken})
    } 
 // buscar el usuario
let user = await userModel.findOne({email});
if(!user) return res.sendStatus(400)

const isValidPassword = await validatePassword(password, user.password)
if(!isValidPassword) return res.sendStatus(400)


    user = {
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
    }
    accessToken = generateToken(user)
    res.send({status: "success", accessToken})
})

router.get('/jwtProfile', authToken,async (req, res) => {
    res.send({status: "success", payload: req.user})
})


export default router;