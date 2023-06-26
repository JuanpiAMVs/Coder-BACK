import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';

import viewsRouter from './routes/views.routes.js'
import userRouter from './routes/users.routes.js'

const app = express()

app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', handlebars.engine())       //crea el motor
app.set('views', `${__dirname}/views`)              //carpeta de vistas
app.set('view engine', 'handlebars')                //motor que va a leer las vistas

app.use('/', viewsRouter)                  
app.use('/api/users', userRouter)                  //todo lo que no tenga que ver con views (rutas a renderizar) hay que colocar la ruta app.use('api/') para evitar conflicto de rutas


app.listen(8080, () => console.log("listening on 8080"))