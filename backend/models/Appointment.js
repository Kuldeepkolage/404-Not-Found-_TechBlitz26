import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  date: String,
  start_time: String,
  end_time: String,
  status: { type: String, enum: ["scheduled", "cancelled", "completed"], default: "scheduled" },
  reason: String,
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
