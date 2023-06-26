import { Router } from "express";
import CartManager from "../dao/fileSystem/Managers/CartManager.js";
import ProductManager from "../dao/fileSystem/Managers/ProductManager.js";
import CartsManagerdaoMongo from "../dao/mongo/Managers/cartsManager.js";
import ProductsManagerdaoMongo from "../dao/mongo/Managers/productsManager.js";
import cartsModel from "../dao/mongo/models/carts.model.js";

const router = Router();

const ProductsManager = new ProductManager("carrito.json");
const CartsManager = new CartManager("carrito.json");
const ProductsManagerDaoMongo = new ProductsManagerdaoMongo();
const CartsManagerDaoMongo = new CartsManagerdaoMongo();

router.post("/", async (req, res) => {
  try {
    const createCART = await CartsManagerDaoMongo.createCart();
    return res.status(200).send({ createCART });
  } catch (err) {
    return res.status(400).send(createCART);
  }

  /*     const createCART = await CartsManager.createCart()
    if(createCART.status === "error") return res.status(400).send({status: "error", data: createCART.data}) */
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const getCartProducts = await CartsManagerDaoMongo.getCartBy({_id: cid})
    return res.status(200).send(getCartProducts);
  } catch (err) {
    return res.status(400).send(err);
  }

  /*     const getCartProducts = await CartsManager.getCartById(cid)
    if(getCartProducts.status === "error") return res.status(400).send({status: "error", data: getCartProducts.data}) */
});

router.post("/:cid/product/:pid", async (req, res) => {
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
        const UpdateCart = await CartsManagerDaoMongo.addProductToCart(cid, pid, quantity);
        return res.status(200).send({ status: "success", message: UpdateCart });
    }catch(err){
        res.status(400).send({ status: "error", message: err});
    }
 
 /*  const UpdateCart = await CartsManager.addProductToCart(cid, pid, quantity);
  if (UpdateCart.status === "error")
    return 
  return res.status(200).send({ UpdateCart }); */
});

router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;
    try {
      for (const product of products) {
        try{
          const productFind = await ProductsManagerDaoMongo.getProductBy({ _id: product.product });
          product._id = product.product
        }catch(err){
          return res.status(400).send({ status: "error", message: "Has intentado cargar un producto no existente en la base de datos" });
        }
      }
    } catch (err) {
      return res.status(400).send({ status: "error", error: err.message });
    }

    const cart = await cartsModel.findByIdAndUpdate({ _id: cid }, { products: products }, { new: true });

    return res.status(200).send({ status: 'success', message: 'Cart updated', cart });
  } catch (err) {
    return res.status(400).send({ status: 'error', error: err.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try{
    const {cid} = req.params
    const {pid} = req.params
    const {quantity} = req.body
    
    const updatedCart = await cartsModel.findByIdAndUpdate(cid,{ $set: { 'products.$[elem].quantity': quantity } },
      { new: true, arrayFilters: [{ 'elem._id': pid }] }
    );

    if (!updatedCart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

    return res.status(200).send({ status: 'success', message: 'Cantidad del producto actualizada', cart: updatedCart });
  }catch(err){
    return res.status(400).send({ status: "error", error: err.message})
  }
 
})

router.delete('/:cid', async (req, res) => {
    try{
      const cid = req.params.cid;
      const cart = await cartsModel.findByIdAndUpdate({ _id: cid }, { products: []}, { new: true });
      if (!cart) {
        return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
      }
      return res.status(200).send({status: "success", message: `carrito ${cid} ha sido borrado`})
    }catch(err){
      return res.status(400).send({ status: "error", message: err.message})
    }
})

router.delete("/:cid/products/:pid", async (req,res) => {
  try{
    const cid = req.params.cid;
    const pid = req.params.pid;
    const UpdateCart = await CartsManagerDaoMongo.deleteProductfromCart(cid,pid)
    return res.status(200).send({status:"success", payload: UpdateCart})
  }catch(err){
    res.status(400).send({status: "error", message: err})
  }
})
export default router;
