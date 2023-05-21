import productsModel from "../models/products.model.js";

export default class ProductsManager {
  async getProducts(params) {
    return productsModel.find(params).lean();
  }

  async getProductBy(params) {
    return productsModel.findOne(params).lean();
  }

  async addProduct(product) {
    return productsModel.create(product);
  }

  async updateProduct(id, update) {
    return productsModel.findByIdAndUpdate(id, { $set: update });
  }

  async deleteProduct(id) {
    return productsModel.findByIdAndDelete(id);
  }
}
