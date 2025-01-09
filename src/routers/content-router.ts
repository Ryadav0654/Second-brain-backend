import express from "express";
import {
  addNewContent,
  getAllContent,
  deleteContent,
} from "../controllers/content-controller";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/new", verifyToken, addNewContent);
router.get("/all", verifyToken, getAllContent);
router.delete("/delete/:id", verifyToken, deleteContent);

export default router;
