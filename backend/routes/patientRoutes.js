import express from 'express';
const router = express.Router();
import { 
  createPatient, 
  getPatients, 
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientAppointments
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

// Protected routes
router.use(protect);

router.route('/')
  .post(allowRoles('receptionist'), createPatient)
  .get(getPatients);

router.route('/:id')
  .get(getPatientById)
  .put(allowRoles('receptionist'), updatePatient)
  .delete(allowRoles('receptionist'), deletePatient);

router.get('/:id/appointments', getPatientAppointments);

export default router;
