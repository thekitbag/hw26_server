import request from 'supertest';
import app from '@/app';

describe('Health Check Endpoint', () => {
  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return status ok in JSON', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toEqual({ status: 'ok' });
    });

    it('should have content-type application/json', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
});
