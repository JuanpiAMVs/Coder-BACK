import BaseRouter from "./router.js";
import productsController from '../controllers/products.controllers.js'


export default class ProductsRouter extends BaseRouter{
  init(){
    this.get("/", ["PUBLIC"], productsController.getProducts);
    this.post("/addProduct", ["ADMIN", "PREMIUM"], productsController.addProduct);
    this.get("/:pid", ["PUBLIC"], productsController.getProductById);
    this.put("/:pid", ["ADMIN"], productsController.updateProduct);
    this.delete("/:pid", ["ADMIN", 'PREMIUM'], productsController.deleteProduct);
  }
}