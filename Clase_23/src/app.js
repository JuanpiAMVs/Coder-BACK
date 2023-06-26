import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import sessionsRouter from './routes/session.routes.js'
import __dirname from './utils.js'
import registerChatHandler from './listeners/chatHandler.js'
import initializePassportStrategies from './config/passport.config.js'
import UserRouter from './routes/users.router.js'
import { SessionsRouter } from './routes/session.routes.js'

import {Server} from 'socket.io'


const app = express()

//motor de vistas
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))
app.use(cookieParser())

const connection = mongoose.connect("mongodb+srv://JuanpiAMVs:hiTaY30ZfxsahFoa@ecommerce.gagjgxt.mongodb.net/?retryWrites=true&w=majority")

initializePassportStrategies();


const userRouter = new UserRouter()
const sessionRouter = new SessionsRouter()

app.use((req, res, next) => {
    //HACER ESO LE DA A TODOS LAS RUTAS LA POSIBILIDAD DE ACCEDER A io
    req.io = io;
    next()
})
app.use('/', viewsRouter)
app.use('/api/products', productsRouter )
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', userRouter.getRouter())

app.use('/api/sessionss', sessionRouter.getRouter()) //PRUEBA

app.use('*', async (req, res) => {
    const ruta = req.originalUrl;
    res.send(`Ruta no encontrada: ${ruta}`);
  });

const auth = (req,res,next) => {
    if(req.session?.user === 'pepe' && req.session?.admin){
        return next()
    }
    return res.status(401).send('error de autenticacion')
}

app.get('/setCookie', async (req, res) => {         //setear una cookie
    res
    .cookie('CoderCookie', 'esta es una cookie muy poderosa', {maxAge:100000, signed: true})    //signed: true para firmar cookies y sean seguras
    .send('Cookie')
})
app.get('/getCookies', (req, res) =>{           //revisar las cookies
    res.json({cookie: req.cookies, signedCookie: req.signedCookies})
})
app.get('/deleteCookie',(req,res) => {              //borrar una cookie
    res.clearCookie('CoderCookie').send('Cookie removed')
})
app.get('/session', (req,res) => {      //contador de visitas
    if(req.session.counter){
        req.session.counter++;
        res.send(`Se ha visitado el sitio ${req.session.counter} veces `)
    }else{
        req.session.counter = 1;
        res.send('Welcome')
    }
})
app.get('/logout', (req,res) => {               //destruir sesion, logout
    req.session.destroy(err => {
        if(!err) res.send('Logout Ok')
        else res.send({status: 'Logout error', body: err})
        res.redirect()
    })
})
app.get('/login', (req, res) => {
    const  {username, password} = req.query

    if(username !== 'pepe'  || password !== 'pepepass'){
        return res.send('login failed')
    }
    req.session.username = username
    req.session.admin = true        //para fijarse en la base si es admin o no
    res.send('login success')
})

app.get('/privado', auth, (req,res) => {
    res.send('Si estas viendo esto te logueaste')
})


const PORT = process.env.PORT||8080
const server = app.listen(PORT, () => console.log(`Server up and running on PORT ${PORT}`))


//Server de socket
const io = new Server(server); //unir ambos servers
io.on('connection', socket => {
    registerChatHandler(io, socket)
})


const logs = []

