import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [{
        product:{ type: mongoose.Schema.Types.ObjectId, ref:'Product'},
    }],
});

const cartModel = model("cart", cartSchema);

export { cartModel };