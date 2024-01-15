import * as mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    members: { type: Array },
  },
  { timestamps: true },
);

export const chatModel = mongoose.model('Chat', schema);
