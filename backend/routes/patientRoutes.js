const express = require('express');
const router = express.Router();
const { 
  createPatient, 
  getPatients, 
  getPatientById 
} = require('../controllers/patientController');

// You can import and add your authentication middleware here to protect these routes
// const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(createPatient) // e.g. .post(protect, authorize('receptionist'), createPatient)
  .get(getPatients);

router.route('/:id')
  .get(getPatientById);

module.exports = router;
