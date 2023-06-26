import fs from "fs";
import ProductManager from "./ProductManager.js";
import __dirname from '../../../utils.js'

const ProductsManager = new ProductManager('productos.json')

export default class CartManager {
  constructor(path) {
    this.path = __dirname + "/" + path
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(data);
        return carts;
      }
      return {status: "error", data: `El archivo de la ruta ${this.path} no existe`};
    } catch (err) {
      console.log(err);
    }
  }

  async createCart() {
    try {
      const cart = {
      products: []}
      const carts = await this.getCarts();
      if(carts.status === "error") return {status: "error", data: carts.data}
        cart.id =
          carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
        carts.push(cart);
        const writeCars = await fs.promises.writeFile(
          this.path,
          JSON.stringify(carts, null, "\t")
        );
        console.log("Carrito agregado");
        return cart;
    
    } catch (error) {
      console.log(error);
    }
  }



  async getCartById(id) {
    try {
      if (!id) {
        return {status: "error", data:"Falta ingresar ID"};
      }
      const carts = await this.getCarts();
      if(carts.status === "error") return {status: "error", data: carts.data}
      const findCart = carts.find((carts) => carts.id == id);
      if (!findCart) {
        return {status: "error", data: `El carrito con el ID ${id} no se ha encontrado`};
      }
      return findCart
    } catch (error) {
      console.log(error);
    }
  }

async addProductToCart(cid, pid, quantity = 1){
  try{ //argumentos
    if (!cid || !pid) {
      return {status: "error", data: "Faltan argumentos"};
    }
    //obtener carrito
    const GetCarts =  await this.getCarts()
    if(GetCarts.status === "error") return {status: "error", data: GetCarts.data}
    const indexFind = GetCarts.findIndex((cart) => cart.id == cid);
    if(indexFind == -1) return {status: "error", data: "Cart target not found"}

    const GetProduct = await ProductsManager.getProductById(pid)
    if(GetProduct.status === "error") return {status: "error", message: GetProduct.message}
  
    const repeatedProduct = GetCarts[indexFind].products.findIndex((p) => p.product == pid)
    console.log(repeatedProduct)
    if(repeatedProduct != -1){
      GetCarts[indexFind].products[repeatedProduct].quantity += quantity;
    }else{
      GetCarts[indexFind].products.push({ product:pid, quantity })
    }
  
    const writeProducts = await fs.promises.writeFile(this.path,JSON.stringify(GetCarts, null, "\t"));
    console.log("Producto agregado y carrito actualizado");
    console.log(GetCarts[indexFind])
    return GetCarts[indexFind];

  }catch(error){
    console.log(error);
  }
}
}
