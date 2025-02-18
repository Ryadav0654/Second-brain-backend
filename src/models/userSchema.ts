import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || "";
const expiresIn: string = process.env.ACCESS_TOKEN_EXPIRY || "1h";
interface IUser {
  username: string;
  password: string;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};
userSchema.methods.generateAccessToken = function () {
  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  //@ts-ignore
  return jwt.sign({ user_id: this._id }, accessTokenSecret, { expiresIn });
};

userSchema.methods.generateRefreshToken = function () {
  if (!refreshTokenSecret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }
  //@ts-ignore
  return jwt.sign({ user_id: this._id }, refreshTokenSecret, { expiresIn });
};

const User = model<IUser>("User", userSchema);

export { User };
