import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/dbConnect.js";

dotenv.config({});
connectDB();
const app=express()

const PORT=8080;

app.listen(PORT, ()=>{
    console.log(`Server listen at port ${PORT}`)
})