import express from 'express';
const router = express.Router();
import { 
  createPatient, 
  getPatients, 
  getPatientById 
} from '../controllers/patientController.js';

// You can import and add your authentication middleware here to protect these routes
// const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(createPatient) // e.g. .post(protect, authorize('receptionist'), createPatient)
  .get(getPatients);

router.route('/:id')
  .get(getPatientById);

export default router;
