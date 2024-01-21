import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI || '');
        console.log("connected successfully");
    } catch (error) {
        console.log(`error : ${error.message}`);
        process.exit(1);
    }
}
