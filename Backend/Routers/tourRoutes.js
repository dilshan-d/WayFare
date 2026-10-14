import express from 'express';
import {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} from '../Controllers/tourController.js';
import { protect, adminOnly } from '../Middlwares/authentication.js';

const router = express.Router();

router.get('/', getTours);
router.get('/:id', getTourById);
router.post('/', protect, adminOnly, createTour);
router.put('/:id', protect, adminOnly, updateTour);
router.delete('/:id', protect, adminOnly, deleteTour);

export default router;
