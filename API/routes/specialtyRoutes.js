import express from 'express';
import {
    createSpecialty,
    getAllSpecialties,
    getSpecialtyById,
    updateSpecialty,
    deleteSpecialty,
    getSpecialistsBySpecialty
} from '../controllers/specialtyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllSpecialties);
router.post('/', createSpecialty);
router.get('/:specialtyId/specialists', getSpecialistsBySpecialty);
router
    .route('/:id')
    .get(protect, getSpecialtyById)
    .put(protect, updateSpecialty)
    .delete(protect, deleteSpecialty);

export default router;
