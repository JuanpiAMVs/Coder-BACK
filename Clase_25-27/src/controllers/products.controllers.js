import {productsService } from "../services/services.js";

export const getProducts = async(req,res)=>{
        try{
        const {limit=10, page = 1, sort, query} = req.query

            if(limit !== undefined && isNaN(limit)){
                return res.sendBadRequest({ message: `${limit} is not a number`})
            }
            if(limit < 0) {
                return res.sendBadRequest({ message: `${limit} It has to be a positive number` })
            }

          let filter = {}
            if(query){
                filter = {category: query}
            }
            const result = await productsService.paginate(filter, {page, limit: limit, sort: {price: sort}, lean:true});
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
    
            return res.sendSuccess(response)
        }catch(err){
            return res.sendBadRequest(err)
        }
      }


export const getProduct = async(req,res)=>{
    try{
        const {pid}= req.params
        const product= await productsService.getProductBy("_id",pid)
        return res.sendSuccess({ payload: product})
    }
    catch(error){
        return res.sendBadRequest(error)
    }
}

export const addProduct = async (req, res) => {     
        try {
            const productBody = req.body
            if (
              !productBody.title ||
              !productBody.description ||
              !productBody.code ||
              !productBody.price ||
              !productBody.status ||
              !productBody.stock ||
              !productBody.category
            ) {
                return res.sendBadRequest("Faltan argumentos al agregar producto")
            }
            const products = await productsService.getProducts()
            const findCode = await productsService.getProductBy({code: productBody.code});
            if (findCode) {
                return res.sendBadRequest(`El codigo ${findCode.code} ya se encuentra ocupado`)
            } else {    
              if(productBody.thumbnails.length === 0) {
                productBody.thumbnails = []
              }
              const addProduct = await productsService.addProduct(productBody)
              console.log("Producto agregado");
              return res.sendSuccess({ data: addProduct})
            }
    }catch(err){
        return res.sendBadRequest(err)
    }
}

export const updateProduct = async (req, res) => {
    const pid = req.params.pid
    const Updproduct = req.body
    try {
        if (!pid || !Updproduct) {
            return res.sendBadRequest({ data: "Faltan argumentos"});
        }
        const UpdateProduct = await productsService.updateProduct(pid, Updproduct )
        if(!UpdateProduct) return res.sendBadRequest({ data: "Product target not found"});
        console.log("Producto agregado y actualizado");
        return res.sendSuccess({ message: `Product update ${await ProductsManagerDaoMongo.getProductBy({_id: pid})}`})
      } catch (err) {
        return res.sendBadRequest(err)
      }
}

export const deleteProduct = async (req, res) => {
    try{
        const pid = req.params.pid
        const product = await ProductsManagerDaoMongo.deleteProduct(pid)
        return res.sendSuccess({message: `Product with ID ${pid} has been deleted`})
    }catch(err){
        return res.sendBadRequest(err)
    }
}