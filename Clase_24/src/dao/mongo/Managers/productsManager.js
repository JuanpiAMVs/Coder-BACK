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

  async pagina(limit, page, sort, query){
    try{
      let filter = {}
        if(query){
            filter = {category: query}
        }
        const result = await productsModel.paginate(filter, {page, limit: limit, sort: {price: sort}, lean:true});
        const { docs, totalPages, prevPage, nextPage, ...rest } = result;

        const response = {
            status: "success",
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page:rest.page,
            hasPrevPage:rest.hasPrevPage,
            hasNextPage: rest.hasNextPage,
            prevLink: null,
            nextLink:null
        }

        if(rest.hasPrevPage){
            response.prevLink = `/products?limit=${limit}&page=${prevPage}`
        }
        if(rest.hasPrevPage && query){
            response.prevLink = `/products?limit=${limit}&page=${prevPage}&query=${query}`
        }
        if(rest.hasPrevPage && sort){
          response.prevLink = `/products?limit=${limit}&page=${prevPage}&sort=${sort}`
      }
        if(rest.hasPrevPage && query && sort){
          response.prevLink = `/products?limit=${limit}&page=${prevPage}&query=${query}&sort=${sort}`
      }
        if (rest.hasNextPage) {
            response.nextLink = `/products?limit=${limit}&page=${nextPage}`;
          }
          if (rest.hasNextPage && query) {
            response.nextLink = `/products?limit=${limit}&page=${nextPage}&query=${query}`;
          }
          if (rest.hasNextPage && sort) {
            response.nextLink = `/products?limit=${limit}&page=${nextPage}&sort=${sort}`;
          }
          if (rest.hasNextPage && query && sort) {
            response.nextLink = `/products?limit=${limit}&page=${nextPage}&query=${query}&sort=${sort}`;
          }

        return response
    }catch(err){
      return err
    }
  }
}
