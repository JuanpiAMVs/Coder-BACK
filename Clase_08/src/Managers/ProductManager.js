import fs from "fs";

import __dirname from '../utils.js'
export default class ProductManager {
  constructor(path) {
    this.path = __dirname + "/" + path
  }

  async addProduct(obj) {
    try {
      if (
        !obj.title ||
        !obj.description ||
        !obj.code ||
        !obj.price ||
        !obj.status ||
        !obj.stock ||
        !obj.category
      ) {
        return {status: "error", data:"Faltan argumentos al agregar producto"};
      }
      const product = obj;
      const products = await this.getProducts();
      const findCode = products.find((product) => product.code == obj.code);
      if (findCode) {
        return {status: "error", data:`El codigo ${findCode.code} ya se encuentra ocupado`};
      } else {
        product.status = true
        product.thumbnails = []
        product.id =
          products.length > 0 ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        const writeProducts = await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        console.log("Producto agregado");
        return product;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const produts = JSON.parse(data);
        return produts;
      }
      return {status: "error", data: `El archivo de la ruta ${this.path} no existe`};
    } catch (err) {
      console.log(err);
    }
  }

  async getProductById(id) {
    try {
      if (!id) {
        return {status: "error", data:"Falta ingresar ID"};
      }
      const products = await this.getProducts();
      if(products.status === "error") return {status: "error", data: products.data}

      const findProduct = products.find((products) => products.id == id);
      if (!findProduct) {
        return {status: "error", data: `El producto con el ID ${id} no se ha encontrado`};
      }
      return findProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, update) {
    try {
      if (!id || !update) {
        return {status: "error", data: "Faltan argumentos"};
      }
      const products = await this.getProducts();
      const indexFind = products.findIndex((product) => product.id == id);
      if(indexFind == -1) return {status: "error", data: "Product target not found"}
      if(update.id) return {status: "error", data: "No se puede actualizar ID"}
      const productUpdate = {...products[indexFind], ...update}
      products[indexFind] = productUpdate
      const writeProducts = await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      console.log("Producto agregado y actualizado");
      console.log(products[indexFind])
      return products[indexFind];
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const getProduct = await this.getProductById(id)
      if(getProduct.status === "error"){
        return {status: "error", data: "No se ha encontrado la ID"}
      } 
      const newProducts = products.filter((product) => product.id != id);
      console.log(newProducts)
      const writeProducts = await fs.promises.writeFile(
        this.path,
        JSON.stringify(newProducts, null, "\t")
      );
      return `Producto con ID ${id} borrado y lista actualizada`;
    } catch (err) {
      console.log(err);
    }
  }
}
