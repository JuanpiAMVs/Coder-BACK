import { Router } from "express";
import ProductManager from '../dao/fileSystem/Managers/ProductManager.js'
import ProductsManagerMongo from "../dao/mongo/Managers/productsManager.js";
import mongoosePaginate from 'mongoose-paginate-v2'
import productsModel from "../dao/mongo/models/products.model.js";

const router = Router()

const ProductsManager = new ProductManager('productos.json')
const ProductsManagerDaoMongo = new ProductsManagerMongo()

router.get('/', async (req, res) => {
    try{
        const { limit=10, page=1, sort, query } = req.query
        if(limit !== undefined && isNaN(limit)){
            return res.status(400).send({data:{status: "error", message: `${limit} is not a number`}})
        }
        if(limit < 0) {
            return res.status(400).send({data: {status: "error", message: `${limit} It has to be a positive number` }})
        }
/*         const products = await ProductsManagerDaoMongo.getProducts() */
        const paginate = await ProductsManagerDaoMongo.pagina(limit, page, sort, query)
  
        res.status(200).send(paginate)
    
    /*     const products = await ProductsManager.getProducts()
        if(products.status === "error") return res.status(400).send({products}) */
    
    /*     res.json(products) */
    }catch(err){
        return res.status(400).send({err})
    }
   

});

router.get('/:pid', async (req, res) => {
    try{
        const params = req.params
        /*     const product = await ProductsManager.getProductById(params.pid)
            if(product.status === "error") return res.status(400).send({data: {status: "error", message: product.message}})  */
        const product = await ProductsManagerDaoMongo.getProductBy({_id: params.pid})
        res.status(200).send({product})
    }catch(err){
        return res.status(400).send({data: {status: "error", message: err}}) 
    }

})

/* router.post('/',uploader.single("image"), (req, res) => {
    
}) */

router.post('/', async (req, res) => {
    const productBody = req.body
    try {
        if (
          !productBody.title ||
          !productBody.description ||
          !productBody.code ||
          !productBody.price ||
          !productBody.status ||
          !productBody.stock ||
          !productBody.category
        ) {
          return res.status(400).send({status: "error", data:"Faltan argumentos al agregar producto"})
        }
        const products = await ProductsManagerDaoMongo.getProducts();
        const findCode = await ProductsManagerDaoMongo.getProductBy({code: productBody.code});
        if (findCode) {
          return res.status(400).send({status: "error", data:`El codigo ${findCode.code} ya se encuentra ocupado`})
        } else {    
          if(productBody.thumbnails.length === 0) {
            productBody.thumbnails = []
          }
          const addProduct = await ProductsManagerDaoMongo.addProduct(productBody)
          console.log("Producto agregado");
          return res.status(200).send({status: "success", data: addProduct})
        }
      } catch (error) {
        return res.status(400).send({status: "error", message: error})
      }
/*     const addProduct = await ProductsManager.addProduct(product)
    if(addProduct.status === 'error') return res.status(400).send({addProduct}) */

})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    const Updproduct = req.body
    try {
        if (!pid || !Updproduct) {
          return res.status(400).send({status: "error", data: "Faltan argumentos"});
        }
        const UpdateProduct = await ProductsManagerDaoMongo.updateProduct(pid, Updproduct )
        if(!UpdateProduct) return res.status(400).send({status: "error", data: "Product target not found"});
        console.log("Producto agregado y actualizado");
        return res.status(200).send({status: "success", message: `Product update ${await ProductsManagerDaoMongo.getProductBy({_id: pid})}`})
      } catch (err) {
        return res.status(400).send({status: "error", message: err});
      }
/*     const UpdateProduct = await ProductsManager.updateProduct(pid, product)
    
    if(UpdateProduct.status === "error") return res.status(400).send({UpdateProduct})
    return res.status(200).send({status: "success", data: UpdateProduct}) */
})

router.delete('/:pid', async (req, res) => {
    try{
        const pid = req.params.pid
        const product = await ProductsManagerDaoMongo.deleteProduct(pid)
        return res.status(200).send({status: "success", message: `Product with ID ${pid} has been deleted`})
    }catch(err){
        return res.status(400).send({status: "error", message: err})
    }
   
/*     const product = await ProductsManager.deleteProduct(pid)
    if(product.status === "error") return res.status(400).send({product})
    return res.status(200).send({status: "success", data: product}) */
})

export default router