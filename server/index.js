import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./database/dbConnect.js";
import userRoute from "./routes/user.route.js";
import cors from "cors"

// Configure environment variables
dotenv.config({});

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON data
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

// User routes
app.use("/api/v1/user", userRoute);

// Port configuration
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
