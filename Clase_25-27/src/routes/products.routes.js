import BaseRouter from "./router.js";
import { getProduct, getProducts,addProduct,updateProduct, deleteProduct } from "../controllers/products.controllers.js";

export default class ProductsRouter extends BaseRouter{
  init(){
    this.get("/", ["PUBLIC"], getProducts);
    this.post("/", ["ADMIN"], addProduct);
    this.get("/:pId", ["PUBLIC"], getProductById);
    this.put("/:pId", ["ADMIN"], updateProduct);
    this.delete("/:pId", ["ADMIN"], deleteProduct);
  }
}