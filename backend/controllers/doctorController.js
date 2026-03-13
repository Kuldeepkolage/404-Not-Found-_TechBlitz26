import Doctor from '../models/Doctor.js';

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
      slot_duration
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
    res.status(200).json({ success: true, data: doctors });
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


