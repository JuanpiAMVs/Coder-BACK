import mongoose from "mongoose";

const collection = "tickets";

const schema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;