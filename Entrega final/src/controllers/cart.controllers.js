import { productsService, cartsService, ticketServices } from "../services/services.js";
import { v4 as uuidv4 } from 'uuid';
import MailingService from "../services/mail.service.js";
import DTemplates from "../constants/DTemplates.js";

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
    const cId =  req.params.cid
    const cart = await cartsService.getCartById({ _id: cId });
    console.log(cart)
    if (!cart) res.status(404).send({ status: "error", error: "cart not found" });
    res.send({ status: "success", payload: cart });
  } catch (err) {
    console.log(err);
  }
};

export const addProductToCart = async (req, res) => {
        try{
            const cid = req.params.cid;
            const pid = req.params.pid;
            const { quantity } = req.body;
            const product = await productsService.getProductBy({_id: pid})
            if(product.owner === req.user.email) return res.sendBadRequest("Como usuario PREMIUM no puedes añadir tus propios productos al carrito")
            if(product.stock < quantity) req.logger.error(`El producto no tiene suficiente stock ${product.stock}`)
            const UpdateCart = await cartsService.addProductToCart(cid, pid, quantity);
            return res.sendSuccess({ message: UpdateCart });
        }catch(err){
          console.log(err)
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
      try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
         if(!cid, !pid, !quantity) return res.sendBadRequest("Argumentos invalidos")
    
        const updatedProductQuantity = await cartsService.updateProductQuantity(
          cid,
          pid,
          quantity
        );
        if (updatedProductQuantity) {
          res.sendSuccessWithPayload({
            message: "Cantidad actualizada correctamente",
            updatedProductQuantity,
          });
        } else {
          res.sendBadRequest(error.message);
        }
      } catch (error) {
        console.log(error);
        res.sendInternalError(error.message);
      }
    };


export const deleteCart = async (req, res) => {
        try{
          const cid = req.params.cid;
          const cart = await cartsService.updateCart(cid , []);
          console.log(cid)
          if (!cart) {
            return res.sendBadRequest({ message: `Carrito ${cid} no encontrado` });
          }
          return res.sendSuccess({ message: `Todos los productos del carrito ${cid} han sido borrados`})
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


export const Purchase = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsService.getCartById(cartId);
    
    if (!cart) {
      return res.send({status: "error", message: "Carrito no encontrado" });
    }

    const updatedProducts = [];
    let totalAmount = 0
    let totalQuantity = 0

    for (const item of cart.products) {
      const { product, quantity, status } = item;

      if (quantity <= 0) {
        return res.send({status: "error", message: `La cantidad de ${product.title} debe ser mayor que 0`,});
      }

      if (product.stock < quantity) {
        updatedProducts.push({product: product._id, amount: item.amount, quantity,status:"Out of stock"})
      }
      else{
        product.stock -= quantity;
        await product.save()
        updatedProducts.push({ product: product._id, quantity, amount: item.amount, status: "Stock" });
        totalAmount += item.amount
        totalQuantity += item.quantity
      }    
    }

    const StayProducts = updatedProducts.filter((item) => item.status !== "Stock")
    const BuyProducts = updatedProducts.filter((item) => item.status == "Stock")

    const code = uuidv4()
    const user = req.user;

    if (!user) {
      return res.send({status: "error", message: "User not found" });
    }
  
    const ticket = await ticketServices.createTickets({
      code,
      amount: totalAmount,
      purchaser: user.email,
    });

    await ticket.save();

    cart.products = StayProducts
    cart.totalAmount = totalAmount
    cart.totalQuantity = totalQuantity
    await cart.save();
    const {products, amount} = req.body
    console.log(products)
    const emailService = new MailingService()
    const email = await emailService.sendMail(
      req.user.email,DTemplates.COMPRATICKET,{
        email: req.user.email,
        ticketID: ticket._id,
        products: products,
        total: amount
      }
    )
    if (email) {
      console.log("Email enviado");
    } else {
      console.error("Error al enviar Email");
    }

    return res.sendSuccessWithPayload({ "Productos comprados": BuyProducts, "Productos sin stock": StayProducts });
  } catch (error) {
    console.log(error);
    return res.sendInternalError(error.message);
  }
};


  