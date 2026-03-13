import express from "express";
const router = express.Router();

import {
    bookAppointment,
    getAppointments,
    rescheduleAppointment
} from "../controllers/appointmentController.js";

router.post("/book", bookAppointment)

router.get("/", getAppointments)

router.put("/:id/reschedule", rescheduleAppointment)

export default router;