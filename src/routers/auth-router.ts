import express from "express";
import {
  signinController,
  signupController,
  logoutController,
  getUser,
} from "../controllers/auth-controller";
import verifyToken from "../middleware/verifyToken";
const router = express.Router();

// interface User {
//     username: string;
//     password: string;
// };

// type SigninControllerType = typeof signinController;

router.post("/signin", signinController);
router.get("/user", verifyToken, getUser);
router.post("/signup", signupController);
router.post("/logout", verifyToken, logoutController);

export default router;
