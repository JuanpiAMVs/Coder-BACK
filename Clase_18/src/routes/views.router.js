import { Router } from "express";
import ProductManager from '../dao/fileSystem/Managers/ProductManager.js'
import ProductsManagerdaoMongo from '../dao/mongo/Managers/productsManager.js'
import CartsManager from "../dao/mongo/Managers/cartsManager.js";

const ProductsManager = new ProductManager('productos.json')
const ProductsManagerDaoMongo = new ProductsManagerdaoMongo()
const CartsManagerDaoMongo = new CartsManager()
const router = Router()

router.get('/', async (req, res) => {
    try{
        const AllProducts = await ProductsManagerDaoMongo.getProducts()
        res.render('home', {           // se envia el html y los valores a renderizar
            css:'home',
            AllProducts: AllProducts           
        })
    }catch(err){
        return res.status(400).send(err)
    }

/*     const AllProducts = await ProductsManager.getProducts()
    if(AllProducts.status === "error") return res.status(400).send({AllProducts}) */

})



router.get('/realtimeproducts', async (req, res) => {
    try{
        const products = await ProductsManagerDaoMongo.getProducts()
       /*  if(products.status === "error") return res.status(400).send({status: "error", message: products.data}) */
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

router.get('/chat', async(req,res) => {
    res.render('chat')
})

router.get('/products', async (req,res) => {
    try{
        const { limit=10, page=1, sort, query } = req.query
        if(limit !== undefined && isNaN(limit)){
            return res.status(400).send({data:{status: "error", message: `${limit} is not a number`}})
        }
        if(limit < 0) {
            return res.status(400).send({data: {status: "error", message: `${limit} It has to be a positive number` }})
        }
        const paginate = await ProductsManagerDaoMongo.pagina(limit, page, sort, query)
        if(!paginate) return res.status(400).send({status: "error", message: 'Error al encontrar productos'}) ;
        
        res.render('products', {       
            css:'home',
            products: paginate.payload,
            totalPages: paginate.totalPages,
            prevPage: paginate.prevPage,
            nextPage: paginate.nextPage,
            page: paginate.page,
            hasPrevPage: paginate.hasPrevPage,
            hasNextPage: paginate.hasNextPage,
            prevLink: paginate.prevLink,
            nextLink: paginate.nextLink
        })

    }catch(err){
        return res.status(400).send({status: "error", message: err})
    }
})

router.get('/carts/:cid', async (req,res) => {
    try{
        const {cid} = req.params
        const productsOnCart = await CartsManagerDaoMongo.getCartBy({_id: cid})
        console.log(productsOnCart)

        res.render('carts', {
            css:'home',
            productsCart:productsOnCart.products
        })
    }catch(err){
        return res.status(400).send({status: "error", message: err.message})
    }
})

export default router