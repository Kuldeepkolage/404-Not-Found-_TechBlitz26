import express from 'express';
const router = express.Router();
import { 
  createDoctor, 
  getDoctors, 
  getDoctorById 
} from '../controllers/doctorController.js';

// You can import and add your authentication middleware here to protect these routes
// const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(createDoctor) // e.g. .post(protect, authorize('receptionist', 'admin'), createDoctor)
  .get(getDoctors);

router.route('/:id')
  .get(getDoctorById);

export default router;
