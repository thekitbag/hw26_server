export interface FeedbackInput {
  locationId: string;
  rating: number;
  comment?: string;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Feedback {
  id: string;
  locationId: string;
  rating: number;
  comment: string | null;
  submittedAt: Date;
  createdAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}
