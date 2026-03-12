const express = require('express');
const router = express.Router();
const { 
  createDoctor, 
  getDoctors, 
  getDoctorById 
} = require('../controllers/doctorController');

// You can import and add your authentication middleware here to protect these routes
// const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(createDoctor) // e.g. .post(protect, authorize('receptionist', 'admin'), createDoctor)
  .get(getDoctors);

router.route('/:id')
  .get(getDoctorById);

module.exports = router;
