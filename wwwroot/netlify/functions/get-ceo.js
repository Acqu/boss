import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async (req, res) => {
    try {
        const result = await pool.query('SELECT username, password FROM ceocredential LIMIT 1');
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
