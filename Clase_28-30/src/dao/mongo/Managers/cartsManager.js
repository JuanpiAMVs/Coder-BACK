import ProductsManager from "./productsManager.js";
import cartsModel from "../models/carts.model.js";
import mongoose from "mongoose";


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
     const repeatedProduct = await cartsModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": quantity } },
      { new: true }
    );
    if(repeatedProduct){
      console.log("Producto encontrado, cantidad actualizada")
      return repeatedProduct
    }

      const updateCart = await cartsModel.updateOne(
          {_id: cid},
          {$push: { products: { product: new mongoose.Types.ObjectId(pid), quantity, _id: pid}}})
      const GetCart = await this.getCartBy({_id: cid})
      console.log("Producto agregado y carrito actualizado"); 
      return GetCart;
  
    }catch(error){
      console.log(error);
      return err
    }
  }
  async updateCart(cid, updatedProducts) {
    const cart = await this.getCartById(cid);

    if (cart) {
      cart.products = updatedProducts;
      await cart.save();
    } else {
      throw new Error(
        "Carrito no encontrado. Ingrese una ID válida."
      );
    }

    return cart;
  }


  async deleteProductfromCart(cid,pid){
    try{
      const update = await cartsModel.findOneAndUpdate({_id: cid}, {$pull: {products: {_id: pid}}}, {new:true})
      return update
    }catch(err){
      console.log(err)
      return err
    }
  }
}
