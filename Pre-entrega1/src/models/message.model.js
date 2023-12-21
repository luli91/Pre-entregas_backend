import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    username: { type:String, required:true},
    email: { type:String, required: true, unique: true },
    name: { type:String, required: true},
});

const messageModel =model("message", messageSchema);

export { messageModel};