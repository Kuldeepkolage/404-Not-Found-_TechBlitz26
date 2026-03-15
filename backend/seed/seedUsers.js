import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";
import User from "../models/User.js";

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  try {
    // Clear existing users to avoid unique constraint errors on multiples runs
    await User.deleteMany({});

    // Create demo users matching the login page credentials
    await User.create({
      name: "Dr. Smith",
      email: "doctor@clinic.com",
      password: "password", // Pre-save hook will hash this
      role: "doctor"
    });

    await User.create({
      name: "Receptionist",
      email: "receptionist@clinic.com",
      password: "password", // Pre-save hook will hash this
      role: "receptionist"
    });

    // Additional test users
    await User.create({
      name: "Dr Sharma",
      email: "doctor@test.com",
      password: "password123",
      role: "doctor"
    });

    await User.create({
      name: "Reception",
      email: "reception@test.com",
      password: "password123",
      role: "receptionist"
    });

    console.log("✅ Users seeded successfully!");
    console.log("");
    console.log("Demo Credentials:");
    console.log("  Doctor: doctor@clinic.com / password");
    console.log("  Receptionist: receptionist@clinic.com / password");
    console.log("");
    console.log("Test Credentials:");
    console.log("  Doctor: doctor@test.com / password123");
    console.log("  Receptionist: reception@test.com / password123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

seed();