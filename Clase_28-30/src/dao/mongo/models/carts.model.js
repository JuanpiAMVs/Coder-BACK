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
                default:1
            }
        }
    ]
})

schema.pre('findOne', function () {
    this.populate('products.product')
})
schema.pre('find', function () {
    this.populate('products.product')
})

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;