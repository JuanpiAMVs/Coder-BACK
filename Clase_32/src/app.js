import express from 'express'
import compression from 'express-compression'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import {Server} from 'socket.io'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'

import ViewsRouter from './routes/views.router.js'
import ProductsRouter from './routes/products.routes.js'
import CartsRouter from './routes/carts.routes.js'
import SessionsRouter from './routes/session.routes.js'
import __dirname from './utils.js'
import registerChatHandler from './listeners/chatHandler.js'
import initializePassportStrategies from './config/passport.config.js'
import UserRouter from './routes/users.router.js'
import {fork} from 'child_process'
import config from './config/config.js'
import TicketRouter from './routes/tickets.router.js'
import errorHandler from './middlewares/error.js'
import MockingRouter from './routes/mocking.router.js'


console.log(`Padre en proceso con Id ${process.pid}`)

const app = express()
app.use(compression({
    brotli:{enabled: true,zlib:{}}
}))
app.use(errorHandler)

const connection = mongoose.connect(config.MONGO_URL)


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




initializePassportStrategies();


const userRouter = new UserRouter()
const sessionsRouter = new SessionsRouter()
const viewsRouter = new ViewsRouter()
const cartRouter = new CartsRouter()
const productsRouter = new ProductsRouter()
const ticketsRouter = new TicketRouter()

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
app.use("/api/tickets", ticketsRouter.getRouter())
app.use('/api/mockingproducts',MockingRouter )

//Nodemailer
const transport = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user: config.MAILER_EMAIL,
        pass: config.MAILER_PASSWORD
    }
})

app.get('/mail', async (req, res) => {
    const result = await transport.sendMail({
        from:'Juanpis <juenpablogodoyn@gmail.com>',
        to:'juenpablogodoyn@gmail.com',
        subject:'Correo de prueba',
        html: `
        <div>
        <h1>Hola</h1>
        <img src="cid:kaguya"/>
        </div>`,
        //archivos a enviar
        attachments:[
            {
                filename:'NAO',
                path:'./src/docs/NAO.png'
            },
            {
                filename:"Kaguya",
                path:'./src/img/Kaguya.png',
                cid:'kaguya'
            }
        ]
    })
    res.send({status:"success", payload: result})
})


// En caso de no encontrar una ruta
/* app.use('*', async (req, res) => {
    const ruta = req.originalUrl;
    res.send(`Ruta no encontrada: ${ruta}`);
  }); */


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



const PORT = config.PORT || 8080
const server = app.listen(PORT, () => console.log(`Server up and running on PORT ${PORT}`))


//Server de socket
const io = new Server(server); //unir ambos servers
io.on('connection', socket => {
    registerChatHandler(io, socket)
})


const logs = []

