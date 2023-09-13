import mongoose from "mongoose";
import EErrors from "../constants/EErrors.js";
import { productsErrorIncompleteValues } from "../constants/productsErrors.js";
import ErrorService from "../services/ErrorService.js";
import {productsService } from "../services/services.js";

 const getProducts = async(req,res)=>{
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


const getProductById = async (req, res) => {
    try{
        const pid = req.params.pid
        if(!pid) return res.sendBadRequest("Ingrese los parametros")
        const product= await productsService.getProductById(pid)
        console.log(product)
        return res.sendSuccess({ payload: product})
    }
    catch(error){
      console.log(error)
        return res.sendBadRequest(error)
    }
}

const addProduct = async (req, res) => {     
        try {
            const {title,stock, description, price, category, code, thumbnails} = req.body
            const product = {
              title,
              description,
              price,
              category,
              code,
              thumbnails,
              stock,
              owner: req.user.email
            }
            if (!title ||!description ||!code || !price || !stock ||!category
            ) {
                ErrorService.createError({
                  name: "Error al crear producto",
                  cause: productsErrorIncompleteValues({product}),
                  code: EErrors.INCOMPLETE_VALUES,
                  status: 400
                })
                req.logger.error(`Add product error`);
            }
            const products = await productsService.getProducts()
            const findCode = await productsService.getProductBy({ code:'66666'});
            if (findCode) {
                return res.sendBadRequest(`El codigo ${findCode.code} ya se encuentra ocupado`)
            } else {    
              if(thumbnails.length === 0) {
                thumbnails = []
              }
              if(product.owner = undefined) owner == "ADMIN"
              const addProduct = await productsService.addProduct(product)
              console.log("Producto agregado");
              return res.sendSuccess({ data: addProduct})
            }
    }catch(err){
        console.log(err)
        return res.sendBadRequest(err)
    }
}

 const updateProduct = async (req, res) => {
    const pid = req.params.pid
    const Updproduct = req.body
    try {
        if (!pid || !Updproduct) {
            return res.sendBadRequest({ data: "Faltan argumentos"});
        }
        const UpdateProduct = await productsService.updateProduct(pid, Updproduct )
        if(!UpdateProduct) return res.sendBadRequest( "Product target not found");
        console.log("Producto agregado y actualizado");
        return res.sendSuccess({ message: `Product update ${await ProductsManagerDaoMongo.getProductBy({_id: pid})}`})
      } catch (err) {
        return res.sendBadRequest(err)
      }
}

const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params
    const product = await productsService.getProductBy({_id: pid})
    if (!product) return res.sendBadRequest(`ID: ${pid} not found`)
    
    if(req.user.role === "ADMIN") {
      const deleteProduct = await productsService.deleteProduct(pid)
    } else if (req.user.role === "PREMIUM" && product.owner === req.user.email) {
      await productsService.deleteProduct(pid);
    }

    return res.sendSuccess(`ID: ${pid} was deleted`);
} catch (error) {
    console.log(error)
    return res.sendInternalError(error)
}
}

export default{
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  addProduct
}