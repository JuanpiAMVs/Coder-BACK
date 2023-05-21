import { Router } from "express";
import ProductManager from '../dao/fileSystem/Managers/ProductManager.js'
import ProductsManagerdaoMongo from '../dao/mongo/Managers/productsManager.js'

const ProductsManager = new ProductManager('productos.json')
const ProductsManagerDaoMongo = new ProductsManagerdaoMongo()
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

export default router