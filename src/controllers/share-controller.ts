import { Request, Response } from "express";
import { Content } from "../models/contentSchema";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../utils/AsyncHandler";
import { Link } from "../models/linkSchema";
import { CustomRequest } from "../middleware/verifyToken";
import { User } from "../models/userSchema";

const generateLinkController = asyncHandler(
  async (req: Request, res: Response) => {
    const { share } = req.body;
    const user = (req as CustomRequest).user as { user_id: string };
    const { user_id } = user;
    // return res.status(200).json({share, user_id});
    const linkAlreadyExist = await Link.findOne({
      userId: user_id,
    });

    if (linkAlreadyExist && share) {
      const { shareId } = linkAlreadyExist;
      return res
        .status(200)
        .json({ shareId: shareId, message: "Link already exist!" });
    }

    if (share) {
      const shareId = uuidv4();
      const link = await Link.create({
        shareId: shareId,
        userId: user_id,
      });
      // console.log("link", link);
      if (!link) {
        return res.status(500).json({ message: "Error to create link" });
      }

      return res
        .status(200)
        .json({ shareId: shareId, message: "Link created successfully!" });
    } else {
      const linkDeleted = await Link.deleteOne({
        userId: user_id,
      });
      // console.log("deleted", linkDeleted);

      if (!linkDeleted.acknowledged) {
        return res.status(500).json({ message: "Error to delete link" });
      }

      return res.status(200).json({ message: "Link deleted successfully" });
    }
  }
);

const shareContentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { shareId } = req.params;
    try {
      const link = await Link.findOne({ shareId: shareId });
      if (!link) {
        return res.status(500).json({ message: "Link is not Valid!" });
      }

      const user = await User.findById(link.userId);
      if (!user) {
        return res.status(500).json({ message: "User not found!" });
      }

      const contents = await Content.find({ userId: user._id }).populate(
        "userId",
        "username"
      );
      if (!contents) {
        return res.status(500).json({ message: "Error to get contents" });
      }

      return res
        .status(200)
        .json({ username: user.username, contents: contents });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Something went wrong" });
    }
  }
);

export { shareContentController, generateLinkController };
