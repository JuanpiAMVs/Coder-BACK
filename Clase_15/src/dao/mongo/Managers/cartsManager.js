import ProductsManager from "./productsManager.js";
import cartsModel from "../models/carts.model.js";

const ProductsManagerDaoMongo = new ProductsManager();

export default class CartsManager {
  constructor() {}

  async getCarts() {
    try {
      const carts = await cartsModel.find();
      return carts
    } catch (err) {
        console.log(err);
    }
  }

  async createCart() {
      const cart = {
        products: [],
      };
      const addCart = await cartsModel.create(cart);
      console.log("Carrito agregado");
      return addCart
  }

  async getCartBy(params) {
    try {
      return cartsModel.findOne(params).lean()
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(cid, pid, quantity = 1){
    try{
      const GetCart = await this.getCartBy({_id: cid});
      const GetProduct = await ProductsManagerDaoMongo.getProductBy({_id: pid})
      const GetCarts = await this.getCarts()
      const repeatedProduct = GetCart.products.findIndex((p) => parseInt(p.product) === parseInt(pid))
      if(repeatedProduct != -1){
        GetCart.products[repeatedProduct].quantity += quantity;
      }else{
        const updateCart = GetCart.products.push({ product:parseInt(pid), quantity })
      }
      const update = await cartsModel.findByIdAndUpdate(cid, {$set: GetCart })
      console.log("Producto agregado y carrito actualizado");
      return GetCart;
  
    }catch(error){
      console.log(error);
    }
  }
}
