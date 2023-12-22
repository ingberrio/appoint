import express from 'express';
import {
  createAppointment,
  getAppointmentsBySpecialist,
  getAppointmentsByCustomer,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Apply rate limiting to all routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  
router.use(limiter);

// @desc    Crear una nueva cita
// @route   POST /api/appointments
// @access  Private
router
  .route('/')
  .post(createAppointment);

// @desc    Obtener todas las citas de un especialista
// @route   GET /api/appointments/specialist/:id
// @access  Private
router.get('/specialist/:id', getAppointmentsBySpecialist);

// @desc    Obtener todas las citas de un cliente
// @route   GET /api/appointments/customer/:id
// @access  Private
router.get('/customer/:id', protect, getAppointmentsByCustomer);

// Otros enrutamientos según sea necesario

export default router;
