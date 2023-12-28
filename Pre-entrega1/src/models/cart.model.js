import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref:'products'},
        quantity: { type: Number, required: true, min: 1 }
    }],
});
//biblioteca que proporciona funcionalidad de paginación para los modelos de Mongoose
cartSchema.plugin(mongoosePaginate); 

const cartModel = model("cart", cartSchema);

export { cartModel };