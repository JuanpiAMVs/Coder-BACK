import { Router } from "express";
import CartManager from "../Managers/CartManager.js";
import ProductManager from "../Managers/ProductManager.js"

const router = Router()

const ProductsManager = new ProductManager('carrito.json')
const CartsManager = new CartManager('carrito.json')

router.post('/',async (req, res) => {
    const createCART = await CartsManager.createCart()
    if(createCART.status === "error") return res.status(400).send({status: "error", data: createCART.data})
    return res.status(200).send({createCART})

})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    const getCartProducts = await CartsManager.getCartById(cid)
    if(getCartProducts.status === "error") return res.status(400).send({status: "error", data: getCartProducts.data})
    return res.status(200).send(getCartProducts)
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const {quantity} = req.body
    const UpdateCart = await CartsManager.addProductToCart(cid, pid, quantity)
    if(UpdateCart.status === "error") return res.status(400).send({status: "error", message: UpdateCart.message})
    return res.status(200).send({UpdateCart})

})

export default router