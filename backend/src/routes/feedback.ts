// /Users/emrepalaz/Desktop/EmKaHan/Stok_kontrol/backend/src/routes/feedback.ts
import express from 'express';
import { submitFeedback, getFeedbacks } from '../controllers/feedbackController';
import { authenticate } from '../middleware/auth';
import { validateRequest, feedbackSchema } from '../middleware/validation';

const router = express.Router();

// Protected routes
router.post('/', authenticate, validateRequest(feedbackSchema), submitFeedback);
router.get('/', authenticate, getFeedbacks);

export default router;