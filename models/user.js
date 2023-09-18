import { Schema, model } from "mongoose";

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  friends: [
    {
      ref: "Person",
      type: Schema.Types.ObjectId,
    },
  ],
});

export default model("User", schema);
