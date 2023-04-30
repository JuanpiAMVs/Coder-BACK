import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'

import {Server} from 'socket.io'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

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
const server = app.listen(PORT, () => console.log("Server up and running on PORT 8080"))

//Server de socket
const io = new Server(server); //unir ambos servers

const logs = []
//on es el escuchador de eventos
/* io.on('connection', socket => {   */                   //escucha el socket.emit('message') del lado del ciente y obtiene la data
/*     console.log("Nuevo cliente conectado") */
    /* socket.on('message', data => {   */    //La data aqui es el mensaje
      /*   logs.push({id: socket.id, message: data}) */
       /*  console.log(data) */
        //si hago socket.emit, se le envia solo a ese socket
       /*  socket.emit('logs', data) */
       //io.emit le envia la data a todos
       /* io.emit('logs',logs) */
   /*  })  */
/* }) */
