import { Schema, Document } from "mongoose";

export interface Chat {
    text: string;
    createdAt: Date;
    updatedAt: Date;
    userId: Schema.Types.ObjectId;
    boardId: Schema.Types.ObjectId;

}

export interface ChatDocument extends Document, Chat {}
