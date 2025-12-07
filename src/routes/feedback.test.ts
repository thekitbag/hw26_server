import request from 'supertest';
import app from '@/app';
import { pool } from '@/config/database';

// Mock the database pool
jest.mock('@/config/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockQuery = pool.query as jest.MockedFunction<typeof pool.query>;

describe('POST /api/v1/feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Valid Submissions', () => {
    it('should create feedback and return 201 with id', async () => {
      const mockFeedback = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        locationId: 'loc-123',
        rating: 4,
        comment: 'Great service!',
        submittedAt: new Date('2025-12-07T12:00:00Z'),
        createdAt: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockFeedback],
        rowCount: 1,
      } as never);

      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          locationId: 'loc-123',
          rating: 4,
          comment: 'Great service!',
          submittedAt: '2025-12-07T12:00:00Z',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: mockFeedback.id,
        message: 'Feedback submitted successfully',
      });
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('should accept feedback without comment', async () => {
      const mockFeedback = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        locationId: 'loc-456',
        rating: 5,
        comment: null,
        submittedAt: new Date('2025-12-07T12:00:00Z'),
        createdAt: new Date(),
        ipAddress: null,
        userAgent: null,
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockFeedback],
        rowCount: 1,
      } as never);

      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          locationId: 'loc-456',
          rating: 5,
          submittedAt: '2025-12-07T12:00:00Z',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(mockFeedback.id);
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 when locationId is missing', async () => {
      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          rating: 4,
          submittedAt: '2025-12-07T12:00:00Z',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
      expect(response.body.error.errors).toBeDefined();
    });

    it('should return 400 when rating is missing', async () => {
      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          locationId: 'loc-123',
          submittedAt: '2025-12-07T12:00:00Z',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 when rating is below 1', async () => {
      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          locationId: 'loc-123',
          rating: 0,
          submittedAt: '2025-12-07T12:00:00Z',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 when rating is above 5', async () => {
      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          locationId: 'loc-123',
          rating: 6,
          submittedAt: '2025-12-07T12:00:00Z',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 when rating is not an integer', async () => {
      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          locationId: 'loc-123',
          rating: 3.5,
          submittedAt: '2025-12-07T12:00:00Z',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 when comment exceeds 500 characters', async () => {
      const longComment = 'a'.repeat(501);

      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          locationId: 'loc-123',
          rating: 4,
          comment: longComment,
          submittedAt: '2025-12-07T12:00:00Z',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 when submittedAt is missing', async () => {
      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          locationId: 'loc-123',
          rating: 4,
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 when submittedAt is not ISO 8601 format', async () => {
      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          locationId: 'loc-123',
          rating: 4,
          submittedAt: 'invalid-date',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });
  });
});
