import { Schema, Types, model } from "mongoose";

enum Type {
  DOCUMENT = "document",
  TWEET = "tweet",
  YOUTUBE = "youtube",
  LINK = "link",
}

interface IContent {
  type: Type;
  title: string;
  link: string;
  tags?: string[];
  userId: Types.ObjectId;
}

const contentSchema = new Schema<IContent>(
  {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    tags: {
      type: [Schema.Types.String],
      ref: "Tags",
      required: false,
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

export const Content = model<IContent>("Content", contentSchema);
