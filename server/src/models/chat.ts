import { Schema, model } from "mongoose";
import { ChatDocument } from "../types/chat.interface";

const chatSchema = new Schema<ChatDocument>({
    text: {
        type: String,
        required: true,
    },

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        required: true,
    },

});

export default model<ChatDocument>("Chat", chatSchema);
