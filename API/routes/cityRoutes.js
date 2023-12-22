import express from "express";
import {
  getAllCity,
  registerCity,
  getOneCity,
  updateCity,
  removeCity,
} from "../controllers/cityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(getAllCity)
    .post(registerCity);
router
  .route('/:id')
  .get(protect, getOneCity)
  .put(protect, updateCity)
  .delete(protect, removeCity);

export default router; 