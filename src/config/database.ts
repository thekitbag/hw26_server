import { Pool } from 'pg';
import { config } from '@/config/env';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('[Database] Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('[Database] Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('[Database] Query error', { text, error });
    throw error;
  }
};
