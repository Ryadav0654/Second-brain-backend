import { Schema, model } from "mongoose";
import { string } from "zod";

const tagSchema = new Schema({
  tags: {
    type: [string],
    required: true,
  },
});

const Tags = model("Tags", tagSchema);
export { Tags };
