import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../Controllers/userController.js';
import { protect, adminOnly } from '../Middlwares/authentication.js';

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;