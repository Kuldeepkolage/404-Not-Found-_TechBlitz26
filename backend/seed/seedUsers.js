import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import mongoose from "mongoose";
import User from "../models/User.js";

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  try {
    // Clear existing users to avoid unique constraint errors on multiples runs
    await User.deleteMany({});

    await User.create({
      name: "Dr Sharma",
      email: "doctor@test.com",
      password: "password123", // Pre-save hook will hash this
      role: "doctor"
    });

    await User.create({
      name: "Reception",
      email: "reception@test.com",
      password: "password123", // Pre-save hook will hash this
      role: "receptionist"
    });

    console.log("Users seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seed();