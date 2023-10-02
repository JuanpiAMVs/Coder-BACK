import ProductManager from '../dao/fileSystem/Managers/ProductManager.js'
import ProductsManagerdaoMongo from '../dao/mongo/Managers/productsManager.js'
import CartsManager from "../dao/mongo/Managers/cartsManager.js";
import { passportCall, generateToken } from "../services/auth.js";
import BaseRouter from "./router.js";
import sessionControllers from '../controllers/session.controllers.js';
import viewsControllers from '../controllers/views.controllers.js';

const ProductsManager = new ProductManager('productos.json')
const ProductsManagerDaoMongo = new ProductsManagerdaoMongo()
const CartsManagerDaoMongo = new CartsManager()

export default class ViewsRouter extends BaseRouter{
    init(){
        this.get('/', ["PUBLIC"],async (req, res) => {
            try{
                const AllProducts = await ProductsManagerDaoMongo.getProducts()
                res.render('home', {           // se envia el html y los valores a renderizar
                    css:'home',
                    AllProducts: AllProducts           
                })
            }catch(err){
                return res.status(400).send(err)
            }  
        })

        this.get('/realtimeproducts', ["ADMIN"],async (req, res) => {
            try{
                const products = await ProductsManagerDaoMongo.getProducts()
                req.io.on('connection', async(socket) => {
                    console.log('Cliente conectado: realtimeproducts')
                    req.io.emit('products', products )
                    socket.on('newProduct', async data => {
                        console.log(data)
                        /* const addProduct = await ProductsManager.addProduct(data) */
                        const addProduct = await ProductsManagerDaoMongo.addProduct(data)
                        req.io.emit('addProduct', data)
                    })
                    socket.on('deleteProduct', async id => {
                        const deleteProduct = await ProductsManagerDaoMongo.deleteProduct(id)
                        const productos = await ProductsManagerDaoMongo.getProducts()
                        /* const deleteProduct = await ProductsManager.deleteProduct(id)
                        const products = await ProductsManager.getProducts() */
                        req.io.emit('products', productos)
                    })
                    
                })
                res.render('realTimeProducts',{
                    css: 'realTimeProducts'
                })
            
            }catch(err){
                return res.status(400).send(err)
            }
           
        })

        this.get('/chat', ["PUBLIC"],  async(req,res) => {
            res.render('chat')
        })

        this.get('/products',["PUBLIC"], viewsControllers.getProducts)


        this.get('/register',  ["PUBLIC"],async (req, res) => {
            res.render('register')
        })
        
        this.get('/login', ["PUBLIC"],async (req, res) => {
            res.render('login')
        })
        
        this.get('/', passportCall('jwt', {redirect:'/login'}) ,async (req, res) => {
            console.log(req.user)
            res.render('jwtProfile', {user: req.user})
        
        })
        
        this.get("/restoreRequest", ["PUBLIC"],viewsControllers.restoreRequestView);

        this.get("/restorePassword", ["PUBLIC"],viewsControllers.getRestorePasswordView);


        this.get('/current', ["ADMIN"], passportCall('current', {strategyType:"locals"}), (req, res) => {
            res.sendSuccessWithPayload({user: req.user})
        })

        this.get('/cart', ["USER"], viewsControllers.getProductsOnCart)
    }
}








