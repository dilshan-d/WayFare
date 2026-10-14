import express from 'express';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../Controllers/hotelController.js';
import { protect, adminOnly } from '../Middlwares/authentication.js';

const router = express.Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.post('/', protect, adminOnly, createHotel);
router.put('/:id', protect, adminOnly, updateHotel);
router.delete('/:id', protect, adminOnly, deleteHotel);

export default router;
