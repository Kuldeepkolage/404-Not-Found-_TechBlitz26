import express from 'express';
const router = express.Router();
import { 
  createDoctor, 
  getDoctors, 
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAvailableSlots
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

// Public routes
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots/:date', protect, getAvailableSlots);

// Protected routes - Receptionist/Admin only
router.post('/', protect, allowRoles('receptionist'), createDoctor);
router.put('/:id', protect, allowRoles('receptionist'), updateDoctor);
router.delete('/:id', protect, allowRoles('receptionist'), deleteDoctor);

export default router;
