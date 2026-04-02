import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: "../../packages/order-db/.env",
});

let isConnected = false;

export const connectOrderDB = async () => {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not defined in .env file");
    }
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        isConnected = true;
        console.log("connected to MongoDB");
    } catch (error) {
        console.log(error);
        throw error;
    }
};
