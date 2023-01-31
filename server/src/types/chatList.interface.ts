import { Schema, Document } from "mongoose";

export interface ChatList {
    text: string;
    createdAt: Date;
    updatedAt: Date;
    userName: string;
    boardId: Schema.Types.ObjectId;

}

export interface ChatListDocumnet extends Document, ChatList {}
