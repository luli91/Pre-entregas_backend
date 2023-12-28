
import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: { type: String, required: true, unique:true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: { type: String },

});

const productModel = model("products", productSchema);

export { productModel };