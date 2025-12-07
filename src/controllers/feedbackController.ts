import { Request, Response, NextFunction } from 'express';
import { FeedbackRepository } from '@/services/FeedbackRepository';
import { FeedbackInput } from '@/types/feedback';

const feedbackRepository = new FeedbackRepository();

export const createFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { locationId, rating, comment, submittedAt } = req.body;

    // Capture IP address and User-Agent for anti-abuse
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const feedbackInput: FeedbackInput = {
      locationId,
      rating,
      comment,
      submittedAt,
      ipAddress,
      userAgent,
    };

    const feedback = await feedbackRepository.create(feedbackInput);

    console.log(`[Feedback] Created feedback ${feedback.id} for location ${locationId}`);

    res.status(201).json({
      id: feedback.id,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('[Feedback] Error creating feedback', error);
    next(error);
  }
};
