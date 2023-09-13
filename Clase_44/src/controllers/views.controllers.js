import jwt from "jsonwebtoken";
import { productsService } from "../services/services.js";

const restoreRequestView = async (req, res) => {
    try {
        res.render('restoreRequest')
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

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

      return  res.render('products', {       
        css:'home',
        products: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink:result.prevLink,
        nextLink: result.nextLink,
        user: req.user
    })
  }catch(err){
    console.log(err)
      return res.sendBadRequest(err)
  }
}


const getRestorePasswordView = async (req, res) => {
    const { token } = req.query;
    try {
      const validToken = jwt.verify(token,"jwtSecret");
      res.render("restorePassword");
    } catch (error) {
      return res.render('invalidToken')
    }

  };

  const restorePassword = (req, res) => {
    res.render('restorePassword')
  }



  export default {
    getProducts,
    getRestorePasswordView,
    restorePassword,
    restoreRequestView
  };