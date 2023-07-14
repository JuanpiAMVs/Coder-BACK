import { productsService, cartsService } from "../services/services.js";

export const getCarts = async (req, res) => {
    try {
        const carts = await cartsService.getCarts();
        return res.sendSuccessWithPayload(carts);
      } catch (error) {
        return res.sendBadRequest(error);
      }
    };

export const createCart = async (req, res) => {
        try {
          const createCART = await cartsService.createCart();
          return res.sendSuccess({ createCART });
        } catch (err) {
            return res.sendBadRequest(err)
        }
}

export const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsService
          .getCartById(cartId)
          .populate("products.product");
        if (cart) {
          return res.sendSuccessWithPayload(cart);
        } else {
          return res.sendBadRequest("Producto no encontrado, ingrese un ID válido");
        }
      } catch (error) {
        return res.sendBadRequest(error.message);
      }
    };

export const addProductToCart = async (req, res) => {
        try{
            const cid = req.params.cid;
            const pid = req.params.pid;
            const { quantity } = req.body;
            const UpdateCart = await cartsService.addProductToCart(cid, pid, quantity);
            return res.sendSuccess({ message: UpdateCart });
        }catch(err){
            return res.sendBadRequest(err);
        }

}

export const updateCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedProducts = req.body.products;
    
        // Verificando si los productos existen en la base de datos
        const productIds = updatedProducts.map((product) => product.product);
        const existingProducts = await productsService.getAllProducts({
          _id: { $in: productIds },
        });
    
        // Validando si se encontraron todos los productos
        if (existingProducts.length !== productIds.length) {
            return res.sendBadRequest("El producto no existe en la base de datos.");     
        }
    
        const updatedCart = await cartsService.updateCart(cartId, updatedProducts);
    
        return res.sendSuccessWithPayload(updatedCart);
      } catch (error) {
        console.log(error);
        return res.sendBadRequest(error);
      }
    };


export const updateProductQuantity = async (req, res) => {   
    try{
        const {cid} = req.params
        const {pid} = req.params
        const {quantity} = req.body
        
        const updatedCart = await cartsModel.findByIdAndUpdate(cid,{ $set: { 'products.$[elem].quantity': quantity } },
          { new: true, arrayFilters: [{ 'elem._id': pid }] }
        );
    
        if (!updatedCart) {
          return res.sendBadRequest({ message: 'Carrito no encontrado' });
        }
    
        return res.sendSuccessWithPayload({ message: 'Cantidad del producto actualizada', cart: updatedCart });
      }catch(err){
        return res.sendBadRequest({error: err.message})
      }
     
}


export const deleteCart = async (req, res) => {
        try{
          const cid = req.params.cid;
          const cart = await cartsModel.findByIdAndUpdate({ _id: cid }, { products: []}, { new: true });
          if (!cart) {
            return res.sendBadRequest({ message: 'Carrito no encontrado' });
          }
          return res.sendSuccess({ message: `carrito ${cid} ha sido borrado`})
        }catch(err){
          return res.sendBadRequest({ message: err.message})
        } 
}

export const deleteProductfromCart = async (req, res) => {
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;
        const UpdateCart = await CartsManagerDaoMongo.deleteProductfromCart(cid,pid)
        return res.sendSuccess({message: `Producto ${pid} eliminado del carrito ${cid}`, payload: UpdateCart})
      }catch(err){
        return res.sendBadRequest({message: err})
      }

}


  