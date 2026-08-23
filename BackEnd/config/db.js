import mongoose from "mongoose";
import dns from "dns";


dns.setServers(["8.8.8.8"], ['1.1.1.1']);


export const connectDB = async () => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })
}