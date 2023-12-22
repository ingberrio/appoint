import express from 'express';
import {
  getAllSpecialist,
  getOneSpecialist,
  authSpecialist,
  registerSpecialist,
  logoutSpecialist,
  getSpecialistProfile,
  updateSpecialistProfile,
  removeSpecialist
} from '../controllers/specialistController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';
import Specialist from '../models/specialistModel.js';

const router = express.Router();

// Defines a route handler for a GET request to the root URL ("/") and populates the "cityId" field for each specialist
router.get('/', async (req, res) => {
  try {
    const specialists = await Specialist.find()
    .populate('cityId')
    .populate('specialtyId') ;
    if (!specialists) {
      res.status(404).json({ message: 'No specialists found' });
      return;
    }
    res.json(specialists);
  } catch (error) {
    console.error('Error fetching specialists:', error);
    res.status(500).json({ error: 'Error fetching specialists' });
  }
});

// Apply rate limiting to all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.use(limiter);

router
  .route('/')
  .get(getAllSpecialist)
  .post(registerSpecialist)

router.post('/auth', authSpecialist);
router.post('/logout', logoutSpecialist);
router
  .route('/profile')
  .get(protect, getSpecialistProfile)
  .put(protect, updateSpecialistProfile)
  .delete(protect, removeSpecialist)

router
  .route('/id')
  .get(protect, getOneSpecialist)

export default router;