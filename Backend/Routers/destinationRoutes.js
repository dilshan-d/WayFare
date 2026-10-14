import express from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../Controllers/destinationController.js';
import { protect, adminOnly } from '../Middlwares/authentication.js';

const router = express.Router();

router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.post('/', protect, adminOnly, createDestination);
router.put('/:id', protect, adminOnly, updateDestination);
router.delete('/:id', protect, adminOnly, deleteDestination);

export default router;
