import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(obj) {
    try {
      if (
        !obj.title ||
        !obj.description ||
        !obj.price ||
        !obj.thumbnail ||
        !obj.code ||
        !obj.stock
      ) {
        console.log("Faltan argumentos al agregar producto");
        return;
      }
      const product = obj;
      const products = await this.getProducts();
      const findCode = products.find((product) => product.code === obj.code);
      if (findCode) {
        console.log(`El codigo ${findCode.code} ya se encuentra ocupado`);
      } else {
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
      console.log(`El archivo de la ruta ${this.path} no existe`);
      return [];
    } catch (err) {
      console.log(err);
    }
  }

  async getProductById(id) {
    try {
      if (!id) {
        console.log("Falta ingresar ID");
        return;
      }
      const products = await this.getProducts();
      const findProduct = products.find((products) => products.id === id);
      if (!findProduct) {
        console.log(`El producto con el ID ${id} no se ha encontrado`);
        return;
      }
      console.log(findProduct);
      return findProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, update) {
    try {
      if (!id || !update) {
        console.log("Faltan argumentos");
        return;
      }
      const products = await this.getProducts();
      const indexFind = products.findIndex((product) => product.id === id);
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
      const newProducts = products.filter((product) => product.id !== id);
      const writeProducts = await fs.promises.writeFile(
        this.path,
        JSON.stringify(newProducts, null, "\t")
      );
      console.log(`Producto con ID ${id} borrado y lista actualizada`);
      return;
    } catch (err) {
      console.log(err);
    }
  }
}
