import express from "express";
import {
  generateLinkController,
  shareContentController,
} from "../controllers/share-controller";
import { verify } from "crypto";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/share", verifyToken, generateLinkController);
router.get("/:shareId", verifyToken, shareContentController);

export default router;
