import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/AsyncHandler";
import { Content } from "../models/contentSchema";
import { CustomRequest } from "../middleware/verifyToken";

const contentZodSchema = z.object({
  type: z.enum(["Document", "Tweet", "Youtube", "Link", "Blog", "Question"]),
  title: z.string(),
  link: z.string(),
  tags: z.array(z.string()).optional(),
});

const addNewContent = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { success, data, error } = await contentZodSchema.safeParseAsync(
      req.body
    );
    const user = (req as CustomRequest).user as { user_id: string };
    // console.log("addnewContent success", success);
    console.log("addnewContent data", data);
    // console.log("addnewContent error", error);

    if (!success) {
      return res.status(411).json({ message: error.errors[0].message });
    }

    const newContent = await Content.create({ ...data, userId: user.user_id });
    if (!newContent) {
      return res.status(500).json({ message: "Error to add new content" });
    }
    console.log("newContent", newContent);
    return res.status(201).json({ message: "Content added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong" });
  }
});

const getAllContent = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user as { user_id: string };
  try {
    const contents = await Content.find({ userId: user.user_id }).populate(
      "userId",
      "username"
    );
    if (!contents) {
      return res.status(500).json({ message: "Error to get contents" });
    }
    return res.status(200).json({ contents });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong" });
  }
});

const deleteContent = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as CustomRequest).user as { user_id: string };
    const content = await Content.findById(id);
    if (!content) {
      return res.status(500).json({ message: "Content not found!" });
    }

    if (content.userId.toString() !== user.user_id) {
      return res
        .status(500)
        .json({ message: "You are not authorized to delete this content!" });
    }

    const deleted = await content.deleteOne();

    if (!deleted.acknowledged) {
      return res.status(500).json({ message: "Error to delete content" });
    }

    return res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong" });
  }
});

export { addNewContent, getAllContent, deleteContent };
