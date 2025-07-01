import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  resetPassword,
  verifyResetToken,
  changePassword
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRequest, userRegistrationSchema, userLoginSchema, updateProfileSchema, resetPasswordSchema, changePasswordSchema } from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(userRegistrationSchema), register);
router.post('/login', validateRequest(userLoginSchema), login);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/change-password/:token', validateRequest(changePasswordSchema), changePassword);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/update-profile', authenticate, validateRequest(updateProfileSchema), updateProfile);
router.post('/delete-account', authenticate, deleteAccount);

export default router;