import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  age: Number,
  gender: String,
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);
