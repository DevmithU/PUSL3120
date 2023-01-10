import { Schema, model } from 'mongoose';
import { BoardDocument } from "../types/board.interface";

const boardSchema = new Schema<BoardDocument>({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userList: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
});
boardSchema.methods.validateMember = function (userId: string) {
  console.log(userId);
  console.log(this.userId);
  console.log("-----------------------------------");
  if((userId==this.userId)||(this.userList.includes(userId))){
    return true;
    console.log("true");

  }
};
export default model<BoardDocument>("Board", boardSchema);
