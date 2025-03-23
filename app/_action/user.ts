"use server";

import db from "@/db/connection";
import userModel from "@/db/model/user";

export  async function registeruser(value: { name: string; email: string; password: string; role: "user" | "admin" | "superadmin" }) {
  await db(); // Ensure DB connection
  
  try {
    // Check if email already exists before saving
    const existingUser = await userModel.findOne({ email: value.email });
    if (existingUser) {
      return { message: "This email is already registered. Please try logging in.", status: false };
    }

    // Create new user
    const user = new userModel(value);
    await user.save();

    return { message: "User registered successfully", status: true };

  } catch (error: any) {
    console.error("Error:", error);

    if (error.code === 11000) {
      return { message: "This email is already in use. Please choose another email.", status: false };
    }

    return { message: "An unexpected error occurred. Please try again later.", status: false };
  }
}
export  async function User() {
    await db(); // Ensure DB connection
    try {
        const response = await userModel.find()
        const users = response; 
        let data = {data: users, status: true};
        
        
        return data;
    } catch (error) {
        return { message: "An unexpected error occurred. Please try again later.", status: false };
    }
};
