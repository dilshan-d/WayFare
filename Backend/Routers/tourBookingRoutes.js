import express from 'express';
import {
  createTourBooking,
  getMyTourBookings,
  getTourBookingById,
  cancelTourBooking,
} from '../Controllers/tourBookingController.js';
import { protect } from '../Middlwares/authentication.js';

const router = express.Router();

router.post('/', protect, createTourBooking);
router.get('/my', protect, getMyTourBookings);
router.get('/:id', protect, getTourBookingById);
router.put('/:id/cancel', protect, cancelTourBooking);

export default router;
