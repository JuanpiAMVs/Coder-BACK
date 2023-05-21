import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema({
    products: [
        {
            product: Number,
            quantity: Number
        }
    ]
})

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;