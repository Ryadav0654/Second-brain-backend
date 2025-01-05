import express from "express";
import {
  signinController,
  signupController,
  logoutController,
} from "../controllers/auth-controller";
const router = express.Router();

// interface User {
//     username: string;
//     password: string;
// };

// type SigninControllerType = typeof signinController;

router.post("/signin", signinController);
router.post("/signup", signupController);
router.post("/logout", logoutController);

export default router;
