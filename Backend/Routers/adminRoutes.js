import express from 'express';
import {
  getAdminStats,
  getAllBookings,
  updateBookingStatus,
} from '../Controllers/adminController.js';
import { protect, adminOnly } from '../Middlwares/authentication.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/bookings', protect, adminOnly, getAllBookings);
router.put('/bookings/:id/status', protect, adminOnly, updateBookingStatus);

export default router;
