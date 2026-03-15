import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import { slotGenerator } from '../utils/slotGenerator.js';

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private (Admin/Receptionist)
export const createDoctor = async (req, res, next) => {
  try {
    const { name, specialization, availability_start, availability_end, slot_duration } = req.body;
    
    const doctor = new Doctor({
      name,
      specialization,
      availability_start,
      availability_end,
      slot_duration: slot_duration || 30
    });

    const savedDoctor = await doctor.save();
    res.status(201).json({ success: true, data: savedDoctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public/Private
export const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public/Private
export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin/Receptionist)
export const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin/Receptionist)
export const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    await doctor.deleteOne();
    res.status(200).json({ success: true, message: 'Doctor removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available slots for a doctor on a specific date
// @route   GET /api/doctors/:id/slots/:date
// @access  Private
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { id, date } = req.params;
    
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Generate all possible slots
    const allSlots = slotGenerator(
      doctor.availability_start || '09:00',
      doctor.availability_end || '17:00',
      doctor.slot_duration || 30
    );
    
    // Get booked appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctor_id: id,
      date: date,
      status: { $ne: 'cancelled' }
    });
    
    const bookedTimes = bookedAppointments.map(appt => appt.start_time);
    
    // Mark slots as booked or available
    const slotsWithAvailability = allSlots.map(time => ({
      time: formatTime12Hour(time),
      isBooked: bookedTimes.includes(time)
    }));
    
    res.status(200).json({ success: true, data: slotsWithAvailability });
  } catch (error) {
    next(error);
  }
};

// Helper function to format time to 12-hour format
const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};


