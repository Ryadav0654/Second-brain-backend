import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./app";
import authRouter from "./routers/auth-router";
import contentRouter from "./routers/content-router";
import shareRouter from "./routers/share-router";
const app: Express = express();
const port: string | number = process.env.PORT || 7000;
const corsOriginUrl: string =
  process.env.CORS_ORIGIN_URL || "http://localhost:3000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: corsOriginUrl,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

// routers
app.use("/api/v1", authRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/brain", shareRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from second brain!");
});

app.listen(port, async () => {
  await connectDB();
  console.log(`Server running on port ${port}`);
});
