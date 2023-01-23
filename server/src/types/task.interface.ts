import { Schema, Document } from "mongoose";

export interface Task {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: Schema.Types.ObjectId;
  boardId: Schema.Types.ObjectId;
  columnId: Schema.Types.ObjectId;
  hasCheck: boolean;
  checkStatus: boolean;
  caption:string;
}

export interface TaskDocument extends Document, Task {}
