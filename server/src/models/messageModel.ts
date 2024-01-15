import * as mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    memberID: String,
    chatID: String,
    message: String,
  },
  { timestamps: true },
);

export const messageModel = mongoose.model('Message', schema);