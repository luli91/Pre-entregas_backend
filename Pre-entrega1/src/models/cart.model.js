import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref:'products'},
        quantity: { type: Number, required: true, min: 1 }
    }],
});


const cartModel = model("cart", cartSchema);

export { cartModel };