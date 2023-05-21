import { Router } from "express";
import CartManager from "../dao/fileSystem/Managers/CartManager.js";
import ProductManager from "../dao/fileSystem/Managers/ProductManager.js";
import CartsManagerdaoMongo from "../dao/mongo/Managers/cartsManager.js";
import ProductsManagerdaoMongo from "../dao/mongo/Managers/productsManager.js";

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
    const getCartProducts = await CartsManagerDaoMongo.getCartBy({ _id: cid });
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

export default router;
