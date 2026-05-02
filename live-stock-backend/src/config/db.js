import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
export const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully...");
        
    }catch(err){
        console.log("err while connecting to mongodb",err);
        
    }
}