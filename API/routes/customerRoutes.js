import express from 'express';
import {
  getAllCustomer,
  authCustomer,
  registerCustomer,
  logoutCustomer,
  getCustomerProfile,
  updateCustomerProfile,
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Apply rate limiting to all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.use(limiter);

router
  .route('/')
  .get(getAllCustomer)
  .post(registerCustomer)

router.post('/auth', authCustomer);
router.post('/logout', logoutCustomer);
router
  .route('/profile')
  .get(protect, getCustomerProfile)
  .put(protect, updateCustomerProfile);

export default router;