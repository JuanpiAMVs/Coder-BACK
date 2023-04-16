import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const ProductsManager = new ProductManager('products.json')

app.get('/products', async (req, res) => {
    const query = req.query
    const search = Object.keys(query)[0]
    const value = Object.values(query)[0]
    const products = await ProductsManager.getProducts()
    if(search == 'limit')  return res.send(products.slice(0, value))
    res.send(products)

})

app.get('/products/:pid', async (req, res) => {
    const params = req.params
    const product = await ProductsManager.getProductById(params.pid)
    res.send(product)
})

app.listen(8080, () => console.log('Listening on PORT 8080'))