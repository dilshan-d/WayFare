import express from 'express';
import {
  createHotelBooking,
  getMyHotelBookings,
  getHotelBookingById,
  cancelHotelBooking,
} from '../Controllers/hotelBookingController.js';
import { protect } from '../Middlwares/authentication.js';

const router = express.Router();

router.post('/', protect, createHotelBooking);
router.get('/my', protect, getMyHotelBookings);
router.get('/:id', protect, getHotelBookingById);
router.put('/:id/cancel', protect, cancelHotelBooking);

export default router;
