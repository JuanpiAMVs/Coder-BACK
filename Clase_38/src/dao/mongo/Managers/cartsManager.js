import ProductsManager from "./productsManager.js";
import cartsModel from "../models/carts.model.js";
import mongoose from "mongoose";
import productsModel from "../models/products.model.js";


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

  async getCartById(cid) {
    try {
      const cart = await cartsModel.findOne({_id: cid}).populate("products.product")
      return cart

    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(cid, pid, quantity = 1){
    try{ 
      const product = await productsModel.findById(pid)   
      const repeatedProduct = await cartsModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": quantity, "products.$.amount": quantity * product.price } },
      { new: true }
    );
    if(repeatedProduct){
      console.log("Producto encontrado, cantidad actualizada")
      return repeatedProduct
    }
    
    const updateCart = await cartsModel.updateOne(
          {_id: cid},
          {$push: { products: { product: new mongoose.Types.ObjectId(pid), quantity,amount: product.price * quantity, _id: pid }}})
      const GetCart = await this.getCartById({_id: cid})
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

  updateProductQuantity = async (cartId, productId, quantity) => {
    const cart = await this.getCartById(cartId);

    if (!cart) {
      throw new Error(
        "Carrito no encontrado. Por favor, ingrese una ID válida."
      );
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === productId
    );

    if (productIndex !== -1) {
      // Actualizar la cantidad del producto en el carrito
      cart.products[productIndex].quantity = quantity;
    } else {
      throw new Error(
        "Producto no encontrado. Por favor, ingrese una ID válida."
      );
    }

    // Guardar los cambios en la base de datos
    await cart.save();

    // Retornar el carrito actualizado
    return cart;
  };


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
