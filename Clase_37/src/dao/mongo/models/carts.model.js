import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema({
    products: [
        {
            product: {
                type:mongoose.SchemaTypes.ObjectId,
                ref: 'Products'
            },
            quantity: {
                type: Number,
            },
            amount: {
                type: Number,
              },
            status: {
              type: String
            }
          }
     ],
          totalAmount:{
              type:Number,
              default: 0
          },
          totalQuantity:{
            type:Number,
            default: 0
          }
        
  
  
  },{timestamps:{createdAt: 'created_at', updatedAt: 'updated_at'}})



const cartsModel = mongoose.model(collection, schema);

export default cartsModel;