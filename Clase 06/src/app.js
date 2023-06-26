import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const ProductsManager = new ProductManager('products.json')

app.get('/products', async (req, res) => {
    const { limit } = req.query
    const products = await ProductsManager.getProducts()
    console.log(products)
    if(limit) {
        return res.json(await products.slice(0, limit))
    } 
    res.json(products)

});

app.get('/products/:pid', async (req, res) => {
    const params = req.params
    const product = await ProductsManager.getProductById(params.pid)
    res.send(product)
})

app.listen(8080, () => console.log('Listening on PORT 8080'))