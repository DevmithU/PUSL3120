import { Schema, model } from 'mongoose';
import { whiteBoardDocument } from "../types/whiteBoard.interface";

const boardSchema = new Schema<whiteBoardDocument>({
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
  // console.log(userId);
  // console.log(this.userId);
  // console.log("-----------------------------------");
  if((userId==this.userId)||(this.userList.includes(userId))){
    return true;
    console.log("true");

  }
};
export default model<whiteBoardDocument>("WhiteBoard", boardSchema);
