import express from "express";
const router = express.Router();

import {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
  getAppointmentsByDoctor,
  getTodayAppointments
} from "../controllers/appointmentController.js";
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

// Apply authentication to all routes
router.use(protect);

// Routes
router.post("/book", allowRoles('receptionist'), bookAppointment);
router.get("/", getAppointments);
router.get("/today", getTodayAppointments);
router.get("/doctor/:doctorId", getAppointmentsByDoctor);
router.get("/:id", getAppointmentById);
router.patch("/:id/status", updateAppointmentStatus);
router.put("/:id/reschedule", allowRoles('receptionist'), rescheduleAppointment);
router.delete("/:id", cancelAppointment);

export default router;