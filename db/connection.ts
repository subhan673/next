import mongoose from "mongoose";

const connectDB = async () => {
if (mongoose.connections[0].readyState) {
    console.log("Already connected.");
    return; 
    
} else {
    try {
        const conn = await mongoose.connect("mongodb+srv://anas:`12345@cluster0.ljcyv.mongodb.net/",);
    
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        process.exit(1);
    }
}


  
};

export default connectDB;