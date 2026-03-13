import Appointment from "../models/Appointment.js";

export const bookAppointment = async(req,res)=>{

    const {patientName,doctor,date,time} = req.body

    const existing = await Appointment.findOne({
        doctor,
        date,
        time
    })

    if(existing){
        return res.status(400).json({
            message:"Slot already booked"
        })
    }

    const appointment = new Appointment({
        patientName,
        doctor,
        date,
        time
    })

    await appointment.save()

    res.json({
        message:"Appointment booked successfully",
        appointment
    })
}

export const getAppointments = async(req,res)=>{
    const appointments = await Appointment.find()
    res.json(appointments)
}

export const rescheduleAppointment = async(req, res) => {
    try {
        const { id } = req.params;
        const { date, time } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { date, time, start_time: time },
            { new: true }
        );

        res.json({
            message: "Appointment rescheduled successfully",
            appointment: updatedAppointment
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to reschedule appointment", error: error.message });
    }
}