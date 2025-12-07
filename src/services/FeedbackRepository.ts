import { pool } from '@/config/database';
import { FeedbackInput, Feedback } from '@/types/feedback';

export class FeedbackRepository {
  async create(data: FeedbackInput): Promise<Feedback> {
    const query = `
      INSERT INTO feedback (
        location_id,
        rating,
        comment,
        submitted_at,
        ip_address,
        user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        location_id as "locationId",
        rating,
        comment,
        submitted_at as "submittedAt",
        created_at as "createdAt",
        ip_address as "ipAddress",
        user_agent as "userAgent"
    `;

    const values = [
      data.locationId,
      data.rating,
      data.comment || null,
      data.submittedAt,
      data.ipAddress || null,
      data.userAgent || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0] as Feedback;
  }

  async findById(id: string): Promise<Feedback | null> {
    const query = `
      SELECT
        id,
        location_id as "locationId",
        rating,
        comment,
        submitted_at as "submittedAt",
        created_at as "createdAt",
        ip_address as "ipAddress",
        user_agent as "userAgent"
      FROM feedback
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}
