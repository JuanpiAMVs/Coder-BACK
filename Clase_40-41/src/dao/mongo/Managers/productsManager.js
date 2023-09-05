import productsModel from "../models/products.model.js";

export default class ProductsManager {
  async getProducts(params) {
    return productsModel.find(params).lean();
  }

  async getProductBy(pid) {
    return productsModel.findById(pid)
  }

  async addProduct(product) {
    return productsModel.create(product);
  }

  async updateProduct(id, update) {
    return productsModel.findByIdAndUpdate(id, { $set: update });
  }

  async deleteProduct(pid) {
    return productsModel.findByIdAndDelete(pid);
  }

  async paginate (filters, options) {
    try {
      const result = await productsModel.paginate(filters, options);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener los productos paginados");
    }
  };
}
