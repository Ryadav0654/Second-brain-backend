import { Request, Response, NextFunction } from "express";
import { Secret, JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
export interface CustomRequest extends Request {
  user: string | JwtPayload;
}

const accessTokenSecret: Secret = process.env.ACCESS_TOKEN_SECRET || "";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // console.log('req.cookies', req.cookies);
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(401).json({ message: "Access Denied! Unauthorized User" });
      return;
    }

    const verified = jwt.verify(token, accessTokenSecret);
    // console.log("verified", verified);
    (req as CustomRequest).user = verified;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid Token", error: error });
  }
};

export default verifyToken;
