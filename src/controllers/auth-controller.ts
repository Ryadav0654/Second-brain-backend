import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/userSchema";
import { asyncHandler } from "../utils/AsyncHandler";

const userZodSchema = z.object({
  username: z
    .string()
    .toLowerCase()
    .min(3, { message: "Username must be 5 or more characters long" })
    .max(10, { message: "Username must be 5 or fewer characters long" })
    .regex(/^[a-z0-9]{6,20}$/, {
      message:
        "Username must not contain special characters or uppercase letters",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must have at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must have at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must have at least one number" })
    .regex(/[@$!%*?&#]/, {
      message: "Password must have at least one special character",
    }),
});

const generateToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(
      500,
      "Something went wrong while generating referesh and access token",
      error
    );
  }
};

const signupController = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { success, data, error } = await userZodSchema.safeParseAsync(
      req.body
    );
    console.log("success, data, error", success, data, error);

    if (!success) {
      return res.status(411).json({ message: error.errors[0].message });
    }

    const { username, password } = data;

    const isUserAlreadyExist = await User.findOne({ username: username });

    if (isUserAlreadyExist) {
      return res
        .status(409)
        .json({ message: "User already exist with this username" });
    }

    const newUser = await User.create({
      username: username,
      password: password,
    });

    if (!newUser) {
      return res
        .status(500)
        .json({ message: "Something went wrong while creating user" });
    }

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

const signinController = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { success, data, error } = await userZodSchema.safeParseAsync(
      req.body
    );
    console.log("success, data, error", success, data, error);

    if (!success) {
      res.status(411).json({ message: error.errors[0].message });
      return;
    }

    const { username, password } = data;
    const isUserExist = await User.findOne({ username: username });

    if (!isUserExist) {
      res
        .status(403)
        .json({ message: "User does not exist with this username" });
      return;
    }

    const isPasswordMatch = await isUserExist.comparePassword(password);

    if (!isPasswordMatch) {
      res.status(401).json({ message: "Invalid user credentials" });
      return;
    }

    const generatedTokens = await generateToken(isUserExist._id.toString());
    if (!generatedTokens || !generatedTokens.accessToken) {
      res
        .status(500)
        .json({ message: "Something went wrong while generating token" });
      return;
    }
    const { accessToken } = generatedTokens;
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({ token: accessToken, message: "user login success" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});
const logoutController = asyncHandler(async (req: Request, res: Response) => {
  try {
    // await User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $unset: {
    //             refreshToken: 1 // this removes the field from document
    //         }
    //     },
    //     {
    //         new: true
    //     }
    // )
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(201)
      .clearCookie("accessToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

export { signinController, signupController, logoutController };
