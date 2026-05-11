import mongoose from "mongoose";

const connectDB= async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/Ekart-YT`);
        console.log("Mongodb connected successfully");
        

        
    } catch (error) {
        console.log("mongodb connection falied " ,error);
        
    }
}

export default connectDB;