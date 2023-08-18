import BaseRouter from "./router.js";
import { getProductBy, getProducts,addProduct,updateProduct, deleteProduct } from "../controllers/products.controllers.js";

export default class ProductsRouter extends BaseRouter{
  init(){
    this.get("/", ["PUBLIC"], getProducts);
    this.post("/", ["ADMIN", "PREMIUM"], addProduct);
    this.get("/:pId", ["PUBLIC"], getProductBy);
    this.put("/:pId", ["ADMIN"], updateProduct);
    this.delete("/:pId", ["ADMIN"], deleteProduct);
  }
}