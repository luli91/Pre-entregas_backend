//DAO es una clase que gestiona los productos de la base de datpos, el dao llama al modelo 

import { productModel } from "../../models/product.model.js";

class ProductDao {

    //este metodo ahora acepta parámetros para query (el filtro de búsqueda), sort (el ordenamiento), skip (la cantidad de documentos a omitir para la paginación) y limit (la cantidad máxima de documentos a devolver). Luego, utiliza estos parámetros para realizar una consulta a la base de datos.
    
    async findProduct(query, sort, skip, limit) {
        return await productModel.find(query).sort(sort).skip(skip).limit(limit);
    }

    async createProduct(product) {
        return await productModel.create(product);
    }

    async updateProduct(_id, product) {
        return await productModel.findOneAndUpdate(_id,product);
    }

    async delete(_id) {
        return await productModel.findByIdAndDelete(_id);
    }
}

export default new ProductDao();
