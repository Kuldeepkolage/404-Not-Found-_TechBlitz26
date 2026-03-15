import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

// @desc    Book new appointment
// @route   POST /api/appointments/book
// @access  Private (Receptionist)
export const bookAppointment = async (req, res, next) => {
  try {
    const { patient_id, doctor_id, date, start_time, end_time, reason } = req.body;

    // Validate patient exists
    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Validate doctor exists
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Check if slot is already booked
    const existing = await Appointment.findOne({
      doctor_id,
      date,
      start_time,
      status: { $ne: 'cancelled' }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked"
      });
    }

    const appointment = new Appointment({
      patient_id,
      doctor_id,
      date,
      start_time,
      end_time: end_time || calculateEndTime(start_time, doctor.slot_duration || 30),
      reason,
      status: 'scheduled'
    });

    await appointment.save();

    // Populate and return
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient_id', 'name phone email')
      .populate('doctor_id', 'name specialization');

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: populatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient_id', 'name phone email')
      .populate('doctor_id', 'name specialization')
      .sort({ date: -1, start_time: 1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient_id', 'name phone email age gender')
      .populate('doctor_id', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['scheduled', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('patient_id', 'name phone email')
     .populate('doctor_id', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Receptionist)
export const rescheduleAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, start_time, end_time } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Check if new slot is available
    const existing = await Appointment.findOne({
      doctor_id: appointment.doctor_id,
      date,
      start_time,
      status: { $ne: 'cancelled' },
      _id: { $ne: id }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "New slot is already booked"
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { date, start_time, end_time, status: 'scheduled' },
      { new: true }
    ).populate('patient_id', 'name phone email')
     .populate('doctor_id', 'name specialization');

    res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      data: updatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments by doctor
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private
export const getAppointmentsByDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    const query = { doctor_id: doctorId };
    if (date) query.date = date;

    const appointments = await Appointment.find(query)
      .populate('patient_id', 'name phone email')
      .sort({ date: -1, start_time: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's appointments
// @route   GET /api/appointments/today
// @access  Private
export const getTodayAppointments = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const appointments = await Appointment.find({ date: today })
      .populate('patient_id', 'name phone email')
      .populate('doctor_id', 'name specialization')
      .sort({ start_time: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate end time
const calculateEndTime = (startTime, durationMinutes) => {
  const [time, period] = startTime.split(' ');
  const [hours, minutes] = time.split(':');
  let totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
  
  if (period === 'PM' && hours !== '12') totalMinutes += 12 * 60;
  if (period === 'AM' && hours === '12') totalMinutes -= 12 * 60;
  
  totalMinutes += durationMinutes;
  
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  const endPeriod = endHours >= 12 ? 'PM' : 'AM';
  const displayHours = endHours % 12 || 12;
  
  return `${displayHours}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
};