const Appointment = require("../models/Appointment")

exports.bookAppointment = async(req,res)=>{

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

exports.getAppointments = async(req,res)=>{
    const appointments = await Appointment.find()
    res.json(appointments)
}