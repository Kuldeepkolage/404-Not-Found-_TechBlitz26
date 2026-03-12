import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  availability_start: String,
  availability_end: String,
  slot_duration: Number,
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
