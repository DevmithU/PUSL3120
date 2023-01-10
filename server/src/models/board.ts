import { Schema, model } from "mongoose";
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
});
boardSchema.methods.validateMember = function (userId: string) {
  console.log(userId);
  console.log(this.userId);

  if(userId==this.userId){
    return true;
    console.log("true");

  }
};
export default model<BoardDocument>("Board", boardSchema);
