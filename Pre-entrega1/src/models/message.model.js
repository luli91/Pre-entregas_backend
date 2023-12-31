
import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    username: { type:String, required:true},
    content: { type: String, required: true },
});

const messageModel =model("message", messageSchema);

export { messageModel};