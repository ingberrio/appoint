import express from 'express';
import {
  createAvailability,
  getAvailabilitiesBySpecialist,
  deleteAvailability,
} from '../controllers/abailabilityController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';


const router = express.Router();

// Apply rate limiting to all routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  
router.use(limiter);

// @desc    Crear una nueva disponibilidad
// @route   POST /api/availability
// @access  Private
router.post('/', protect, createAvailability);

// @desc    Obtener todas las disponibilidades de un especialista
// @route   GET /api/availability/specialist/:id
// @access  Private
router.get('/specialist/:id', getAvailabilitiesBySpecialist);

// @desc    Eliminar una disponibilidad
// @route   DELETE /api/availability/:id
// @access  Private
router.delete('/:id', protect, deleteAvailability);

export default router;
