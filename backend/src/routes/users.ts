import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser
} from '../controllers/userController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateUserUpdate } from '../middleware/validation';

const router = express.Router();

// Protected routes - require authentication
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, validateUserUpdate, updateUserProfile);

// Admin only routes
router.get('/', authenticate, requireAdmin, getAllUsers);
router.put('/:userId/role', authenticate, requireAdmin, updateUserRole);
router.delete('/:userId', authenticate, requireAdmin, deleteUser);

export default router;