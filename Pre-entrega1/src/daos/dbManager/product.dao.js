//DAO es una clase que gestiona los productos de la base de datpos, el dao llama al modelo 

import { productModel } from "../../models/product.model.js";

class ProductDao {
    async findProduct() {
        return await productModel.find();
    }

    async createProduct(product) {
        return await productModel.findById(product);
    }

    async updateProduct(_id, product) {
        return await productModel.findOneAndUpdate(_id,product);
    }

    async delete(_id) {
        return await productModel.findByIdAndDelete(_id);
    }
}

export default new ProductDao();
