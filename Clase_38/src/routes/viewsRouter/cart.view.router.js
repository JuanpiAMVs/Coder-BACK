import BaseRouter from "../router.js";
import { cartsService } from "../../services/services.js";

export default class CartView extends BaseRouter{
    init(){
        this.get('/cart', ["USER"], async (req,res)=>{
           // console.log(`el dueño de este carrito es ${req.user.name}`)
            const user= req.user
            const cid= req.user.cart[0]._id
            const cart= await cartsService.getCartById(cid)
          

            
            res.render('cart',{
                user,
                cart,
                css:'cart'
            })
        })

        
        this.get('/carts/:cid', ["USER"], async (req,res) => {
            try{
                const {cid} = req.params
                const productsOnCart = await CartsManagerDaoMongo.getCartBy({_id: cid})
                console.log(productsOnCart)
        
                res.render('carts', {
                    css:'home',
                    productsCart:productsOnCart.products
                })
            }catch(err){
                return res.status(400).send({status: "error", message: err.message})
            }
        })

    }
}