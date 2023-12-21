import { productModel } from "../../models/product.model.js";
import { messageModel } from "../../models/message.model.js";

class MessageDao {
    async findMessages() {
        return await messageModel.find();
    }

    async findById(_id) {
        return await messageModel.findById(_id);
    }

    async createMessage(message) {
        return await messageModel.create(message);
    }

    async updateMessage(_id, message) {
        return await messageModel.findByIdAndUpdate({ _id }, message);
    }

    async deleteMessage(_id) {
        await productModel.deleteMany({ author: _id });

        return await messageModel.findByIdAndDelete({ _id });
    }
}

export default new MessageDao();