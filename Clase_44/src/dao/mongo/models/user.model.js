import mongoose from 'mongoose'

const collection = "Users"

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email:String,
    age: Number,
    password: String,
    cart: {
        type:mongoose.SchemaTypes.ObjectId,
        ref: 'Carts'
    },
    role: {
        type: String,
        default: "USER",
        enum: ['ADMIN', 'USER', 'PREMIUM'],
    },
    imgProfile:{
      type:String,
      default:'https://assets.stickpng.com/images/585e4beacb11b227491c3399.png'
  },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carts",
      },
    status: {
        type: Boolean,
        default: false
      },
    documents:[
      {
        name: String,
        reference: String
      }
    ],
    last_connection:String
    },

      { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

const userModel = mongoose.model(collection, schema)

export default userModel