import express from "express";
import {
  getAllDiary,
  createDiary,
  updateDiary,
  removeDiary,
} from "../controllers/diaryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(getAllDiary)
    .post(createDiary);
router
  .route('/:id')
  .put(protect, updateDiary)
  .delete(protect, removeDiary);

export default router; 