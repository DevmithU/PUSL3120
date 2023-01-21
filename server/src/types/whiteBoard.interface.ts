import { Schema, Document } from "mongoose";

export interface whiteBoard {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: Schema.Types.ObjectId;
  userList: Array<Schema.Types.ObjectId>;
}

export interface whiteBoardDocument extends Document, whiteBoard {
  validateMember(param1: string): boolean;

}
