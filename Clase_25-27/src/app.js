import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import {Server} from 'socket.io'

import ViewsRouter from './routes/views.router.js'
import ProductsRouter from './routes/products.routes.js'
import CartsRouter from './routes/carts.routes.js'
import SessionsRouter from './routes/session.routes.js'
import __dirname from './utils.js'
import registerChatHandler from './listeners/chatHandler.js'
import initializePassportStrategies from './config/passport.config.js'
import UserRouter from './routes/users.router.js'
import config from './config/env.config.js'
import {fork} from 'child_process'
import os from 'os';

console.log(`Padre en proceso con Id ${process.pid}`)

const app = express()

//motor de vistas
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))
app.use(cookieParser())


let contador = 0;

app.get('/operacion',(req,res)=>{
    //La solución es, correrlo como otro proceso.
    const result = operacionPesada();
    res.send(`Resultado: ${result}`)
})

app.get('/operacionForkeada',(req,res)=>{
    //primero, genero a mi hijo.
    const childProcess = fork('./src/operacionPesada.js');
    //En este momento tengo a mi hijo REFERENCIADO.
    //emit es el equivalente para enviar en SOCKETS
    childProcess.send('Ejecútate plox')
    childProcess.on('message',val=>{
        res.send(`Resultado del proceso forkeado: ${val}`)
    })
    
})

app.get('/contar',(req,res)=>{
    res.send(`Contador en: ${++contador}`);
})


const connection = mongoose.connect("mongodb+srv://JuanpiAMVs:hiTaY30ZfxsahFoa@ecommerce.gagjgxt.mongodb.net/?retryWrites=true&w=majority")

initializePassportStrategies();


const userRouter = new UserRouter()
const sessionsRouter = new SessionsRouter()
const viewsRouter = new ViewsRouter()
const cartRouter = new CartsRouter()
const productsRouter = new ProductsRouter()

app.use((req, res, next) => {
    //HACER ESO LE DA A TODOS LAS RUTAS LA POSIBILIDAD DE ACCEDER A io
    req.io = io;
    next()
})
app.use('/', viewsRouter.getRouter())
app.use('/api/products', productsRouter.getRouter() )
app.use('/api/carts', cartRouter.getRouter())
app.use('/api/sessions', sessionsRouter.getRouter())
app.use('/api/users', userRouter.getRouter())

app.use('*', async (req, res) => {
    const ruta = req.originalUrl;
    res.send(`Ruta no encontrada: ${ruta}`);
  });


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


const PORT = config.app.PORT
const server = app.listen(PORT, () => console.log(`Server up and running on PORT ${PORT}`))


//Server de socket
const io = new Server(server); //unir ambos servers
io.on('connection', socket => {
    registerChatHandler(io, socket)
})


const logs = []

