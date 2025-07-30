// netlify/functions/db.ts
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.BOSS_DB_URL, // Set this in Netlify env vars
    ssl: { rejectUnauthorized: false }
});

export default pool;
