import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'

import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import __dirname from './utils.js'
import registerChatHandler from './listeners/chatHandler.js'

import {Server} from 'socket.io'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//motor de vistas
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    //HACER ESO LE DA A TODOS LAS RUTAS LA POSIBILIDAD DE ACCEDER A io
    req.io = io;
    next()
})
app.use('/', viewsRouter)
app.use('/api/products', productsRouter )
app.use('/api/carts', cartsRouter)


const PORT = process.env.PORT||8080
const server = app.listen(PORT, () => console.log(`Server up and running on PORT ${PORT}`))
const connection = mongoose.connect("mongodb+srv://JuanpiAMVs:hiTaY30ZfxsahFoa@ecommerce.gagjgxt.mongodb.net/?retryWrites=true&w=majority")

//Server de socket
const io = new Server(server); //unir ambos servers
io.on('connection', socket => {
    registerChatHandler(io, socket)
})


const logs = []

