import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import connectDB from "./app";
import authRouter from "./routers/auth-router";

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use("/api/v1", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from second brain!");
});

app.listen(port, async () => {
  await connectDB();
  console.log(`Server running on port ${port}`);
});
