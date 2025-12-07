import { Router } from 'express';
import { createFeedback } from '@/controllers/feedbackController';
import { validateFeedback } from '@/middlewares/validateFeedback';

const router = Router();

router.post('/api/v1/feedback', validateFeedback, createFeedback);

export default router;
