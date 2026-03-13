import Patient from '../models/Patient.js';

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
    const patients = await Patient.find();
    res.status(200).json({ success: true, data: patients });
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


