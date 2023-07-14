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

import { authAddCart } from "../services/auth.js";

export default class CartsRouter extends BaseRouter {
  init() {
    this.get("/", ["NO_AUTH"], getCarts);
    this.post("/", ["PUBLIC"], createCart);
    this.get("/:cid", ["PUBLIC"], getCartById);
    this.put("/:cid", ["PUBLIC"], updateCartById);
    this.delete("/:cid", ["PUBLIC"], deleteCart);
    this.post("/:cid/products/:pid", ["PUBLIC"], authAddCart, addProductToCart);
    this.put("/:cid/products/:pid", ["PUBLIC"], updateProductQuantity);
    this.delete("/:cid/products/:pid", ["PUBLIC"], deleteProductfromCart);
  }
}