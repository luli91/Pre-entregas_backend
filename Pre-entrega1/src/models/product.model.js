
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: { type: String },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        }
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model('product', productSchema);
