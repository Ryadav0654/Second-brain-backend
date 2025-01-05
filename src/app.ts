import mongoose from "mongoose";

const db_url: string = process.env.DB_URL || "mongodb://localhost:27017/test";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(db_url);
    console.log("Database connection successfully!", res.connection.host);
  } catch (error) {
    console.log("Error to connect the Database: ", error);
    process.exit(1);
  }
};

export default connectDB;
