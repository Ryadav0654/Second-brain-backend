import { Schema, Types, model } from "mongoose";

interface ILink {
  shareId: Types.UUID;
  userId: Types.ObjectId;
}
const linkSchema = new Schema<ILink>(
  {
    shareId: {
      type: Schema.Types.UUID,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Link = model<ILink>("Link", linkSchema);

export { Link };
