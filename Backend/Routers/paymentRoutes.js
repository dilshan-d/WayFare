import express from 'express';
import {
  processPayment,
  getMyPayments,
  getAllPayments,
  getPaymentById,
} from '../Controllers/paymentController.js';
import { protect, adminOnly } from '../Middlwares/authentication.js';

const router = express.Router();

router.post('/process', protect, processPayment);
router.get('/my', protect, getMyPayments);
router.get('/admin', protect, adminOnly, getAllPayments);
router.get('/:id', protect, getPaymentById);

export default router;
