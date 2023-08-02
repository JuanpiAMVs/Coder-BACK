export default class CartsService{
    constructor(dao){
        this.dao = dao
    }

    createCart = () => {
        return this.dao.createCart()
    }
    getCarts = () => {
        return this.dao.getCarts()
    }
    getCartById=(cid)=>{
        return this.dao.getCartById(cid)
    }
    updateCart = (cid, updateProducts) => {
        return this.dao.updateCart(cid, updateProducts)
    }
    
    deleteCart=(cid)=>{
        return this.dao.deleteCart(cid)
    }
    
    addProductToCart=(cid,pid)=>{
    return this.dao.addProductToCart(cid,pid)
    }
    updateProductQuantity = (cartId, productId, quantity) => {
        return this.dao.updateProductQuantity(cartId, productId, quantity);
      };
}

