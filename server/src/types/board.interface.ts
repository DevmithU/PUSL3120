import { Schema, Document } from "mongoose";

export interface Board {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: Schema.Types.ObjectId;
  userList: Array<Schema.Types.ObjectId>;
}

export interface BoardDocument extends Document, Board {
  validateMember(param1: string): boolean;

}
