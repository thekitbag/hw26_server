import request from 'supertest';
import { Pool } from 'pg';
import app from '@/app';
import { config } from '@/config/env';

describe('Feedback Integration Tests (Real DB)', () => {
  let testPool: Pool;

  beforeAll(async () => {
    // Create a new pool for test database connection
    testPool = new Pool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
    });

    // Clear feedback table before tests
    await testPool.query('DELETE FROM feedback');
  });

  afterAll(async () => {
    // Clean up and close connection
    await testPool.query('DELETE FROM feedback');
    await testPool.end();
  });

  afterEach(async () => {
    // Clean up after each test
    await testPool.query('DELETE FROM feedback');
  });

  describe('POST /api/v1/feedback', () => {
    it('should persist feedback to database and return 201', async () => {
      const feedbackPayload = {
        locationId: 'loc-integration-test',
        rating: 5,
        comment: 'Excellent service from integration test!',
        submittedAt: '2025-12-07T12:00:00Z',
      };

      // Make HTTP request
      const response = await request(app).post('/api/v1/feedback').send(feedbackPayload);

      // Verify response
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.message).toBe('Feedback submitted successfully');

      const feedbackId = response.body.id;

      // Verify data in database
      const dbResult = await testPool.query('SELECT * FROM feedback WHERE id = $1', [
        feedbackId,
      ]);

      expect(dbResult.rows.length).toBe(1);
      const dbRow = dbResult.rows[0];

      expect(dbRow.location_id).toBe(feedbackPayload.locationId);
      expect(dbRow.rating).toBe(feedbackPayload.rating);
      expect(dbRow.comment).toBe(feedbackPayload.comment);
      expect(new Date(dbRow.submitted_at).toISOString()).toContain('2025-12-07T12:00:00');
      expect(dbRow.created_at).toBeDefined();
      expect(dbRow.ip_address).toBeDefined(); // Should capture IP
    });

    it('should persist feedback without comment', async () => {
      const feedbackPayload = {
        locationId: 'loc-no-comment',
        rating: 4,
        submittedAt: '2025-12-07T13:00:00Z',
      };

      const response = await request(app).post('/api/v1/feedback').send(feedbackPayload);

      expect(response.status).toBe(201);

      const feedbackId = response.body.id;
      const dbResult = await testPool.query('SELECT * FROM feedback WHERE id = $1', [
        feedbackId,
      ]);

      expect(dbResult.rows.length).toBe(1);
      expect(dbResult.rows[0].comment).toBeNull();
    });

    it('should handle multiple feedback submissions for same location', async () => {
      const location = 'loc-multiple';

      const payload1 = {
        locationId: location,
        rating: 5,
        submittedAt: '2025-12-07T14:00:00Z',
      };

      const payload2 = {
        locationId: location,
        rating: 3,
        comment: 'Could be better',
        submittedAt: '2025-12-07T14:30:00Z',
      };

      await request(app).post('/api/v1/feedback').send(payload1);
      await request(app).post('/api/v1/feedback').send(payload2);

      // Verify both records exist
      const dbResult = await testPool.query(
        'SELECT * FROM feedback WHERE location_id = $1 ORDER BY submitted_at',
        [location]
      );

      expect(dbResult.rows.length).toBe(2);
      expect(dbResult.rows[0].rating).toBe(5);
      expect(dbResult.rows[1].rating).toBe(3);
    });

    it('should reject invalid feedback and not persist to DB', async () => {
      const invalidPayload = {
        locationId: 'loc-invalid',
        rating: 10, // Invalid: out of range
        submittedAt: '2025-12-07T12:00:00Z',
      };

      const response = await request(app).post('/api/v1/feedback').send(invalidPayload);

      expect(response.status).toBe(400);

      // Verify nothing was persisted
      const dbResult = await testPool.query(
        'SELECT * FROM feedback WHERE location_id = $1',
        ['loc-invalid']
      );

      expect(dbResult.rows.length).toBe(0);
    });
  });
});
