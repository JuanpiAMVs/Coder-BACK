import { Router } from "express";
import ProductManager from '../Managers/ProductManager.js'
import uploader from "../services/uploader.js";

const router = Router()

const ProductsManager = new ProductManager('productos.json')

router.get('/', async (req, res) => {
    const { limit } = req.query
    const products = await ProductsManager.getProducts()
    if(products.status === "error") return res.status(400).send({products})
    if(limit) {
        return res.status(200).json(await products.slice(0, limit))
    } 
    res.json(products)

});

router.get('/:pid', async (req, res) => {
    const params = req.params
    const product = await ProductsManager.getProductById(params.pid)
    if(product.status === "error") return res.status(400).send({product}) 
    res.status(200).send({product})
})

/* router.post('/',uploader.single("image"), (req, res) => {
    
}) */

router.post('/', async (req, res) => {
    const product = req.body
    const addProduct = await ProductsManager.addProduct(product)
    if(addProduct.status === 'error') return res.status(400).send({addProduct})
    return res.status(200).send({status: "success", data: addProduct})
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    const product = req.body
    const UpdateProduct = await ProductsManager.updateProduct(pid, product)
    if(UpdateProduct.status === "error") return res.status(400).send({UpdateProduct})
    return res.status(200).send({status: "success", data: UpdateProduct})
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    const product = await ProductsManager.deleteProduct(pid)
    if(product.status === "error") return res.status(400).send({product})
    return res.status(200).send({status: "success", data: product})
})

export default router