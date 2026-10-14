import express from 'express';
import { registerUser, loginUser, getMe } from '../Controllers/authController.js';
import { protect } from '../Middlwares/authentication.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
