import BaseRouter from "./router.js";

import {
  getCarts,
  createCart,
  getCartById,
  updateCartById,
  updateProductQuantity,
  deleteCart,
  deleteProductfromCart,
  addProductToCart
} from "../controllers/cart.controllers.js";


export default class CartsRouter extends BaseRouter {
  init() {
    this.get("/", ["PUBLIC"], getCarts);
    this.post("/", ["PUBLIC"], createCart);
    this.get("/:cid", ["PUBLIC"], getCartById);
    this.put("/:cid", ["PUBLIC"], updateCartById);
    this.delete("/:cid", ["PUBLIC"], deleteCart);
    this.post("/:cid/products/:pid", ["USER"], addProductToCart);
    this.put("/:cid/products/:pid", ["PUBLIC"], updateProductQuantity);
    this.delete("/:cid/products/:pid", ["PUBLIC"], deleteProductfromCart);
    this.post("/:cid/purchase", ["ADMIN"])
  }
}