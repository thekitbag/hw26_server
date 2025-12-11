import { pool } from '@/config/database';
import fs from 'fs';
import path from 'path';

const migrate = async () => {
  console.log('[Migration] Starting migration...');
  const client = await pool.connect();

  try {
    const migrationFile = path.join(__dirname, '../../migrations/001_create_feedback_table.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    
    console.log('[Migration] Successfully applied 001_create_feedback_table.sql');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Migration] Failed:', error);
    process.exit(1);
  } finally {
    client.release();
    // We don't close the pool here because the app might start right after
  }
};

// Check if run directly
if (require.main === module) {
  migrate().then(() => process.exit(0));
}

export default migrate;
