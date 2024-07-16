import express from 'express';
import mongoose from 'mongoose'
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

//Mongo DB connection
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log(err);
})

//express app instance
const app = express();

//middleware for allowing the app to send the JSON data to the backend expres server 
app.use(express.json());

//server listening
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

//user route
app.use('/api/user', userRouter);
//auth routes
app.use('/api/auth', authRouter);

//middleware for the error handling
app.use((err,req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})