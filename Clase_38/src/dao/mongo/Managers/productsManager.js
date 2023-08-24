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

  getPaginatedProducts = async (filters, options) => {
    try {
      const result = await productsModel.paginate(filters, options);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener los productos paginados");
    }
  };
}
