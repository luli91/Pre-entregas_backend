
import { messageModel } from "../../models/message.model.js";

class MessageDao {
    async findMessages() {
        return await messageModel.find();
    }

    async createMessage(message) {
        return await messageModel.create(message);
    }
}

export default new MessageDao();