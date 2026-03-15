import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private (Receptionist)
export const createPatient = async (req, res, next) => {
  try {
    const { name, phone, email, age, gender } = req.body;
    
    // Check if patient already exists by phone or email
    const existingPatient = await Patient.findOne({ $or: [{ email }, { phone }] });
    if (existingPatient) {
      return res.status(400).json({ success: false, message: 'Patient with this email or phone already exists' });
    }

    const patient = new Patient({
      name,
      phone,
      email,
      age,
      gender
    });

    const savedPatient = await patient.save();
    res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Receptionist/Doctor)
export const getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single patient by ID
// @route   GET /api/patients/:id
// @access  Private (Receptionist/Doctor)
export const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private (Receptionist)
export const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Receptionist)
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    // Check if patient has upcoming appointments
    const upcomingAppointments = await Appointment.findOne({
      patient_id: req.params.id,
      status: { $in: ['scheduled', 'confirmed'] }
    });
    
    if (upcomingAppointments) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete patient with upcoming appointments. Please cancel appointments first.' 
      });
    }
    
    await patient.deleteOne();
    res.status(200).json({ success: true, message: 'Patient removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient appointment history
// @route   GET /api/patients/:id/appointments
// @access  Private (Receptionist/Doctor)
export const getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient_id: req.params.id })
      .populate('doctor_id', 'name specialization')
      .sort({ date: -1, start_time: -1 });
    
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};


