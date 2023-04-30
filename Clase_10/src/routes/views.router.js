import { Router } from "express";
import ProductManager from '../Managers/ProductManager.js'

const ProductsManager = new ProductManager('productos.json')
const router = Router()

router.get('/', async (req, res) => {
    const AllProducts = await ProductsManager.getProducts()
    if(AllProducts.status === "error") return res.status(400).send({AllProducts})
    res.render('home', {           // se envia el html y los valores a renderizar
        css:'home',
        AllProducts: AllProducts           
    })
})



router.get('/realtimeproducts', async (req, res) => {
    try{
        const products = await ProductsManager.getProducts()
        if(products.status === "error") return res.status(400).send({status: "error", message: products.data})
        req.io.on('connection', async(socket) => {
            console.log('Cliente conectado: realtimeproducts')
            req.io.emit('products', products )
            socket.on('newProduct', async data => {
                console.log(data)
                const addProduct = await ProductsManager.addProduct(data)
                req.io.emit('addProduct', data)
            })
            socket.on('deleteProduct', async id => {
                const deleteProduct = await ProductsManager.deleteProduct(id)
                const products = await ProductsManager.getProducts()
                req.io.emit('products', products)
            })
            
        })
        res.render('realTimeProducts',{
            css: 'realTimeProducts'
        })
    
    }catch(err){
        console.log(err)
    }
   
})

export default router