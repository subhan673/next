"use server";
import mongoose, { Document,  Model} from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please provide a name."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
