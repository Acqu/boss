import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export const handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const query = `
      SELECT id, reference, amount, issuedon
      FROM receipts
      ORDER BY issuedon DESC`;

        const result = await pool.query(query);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Receipts retrieved successfully',
                receipts: result.rows
            })
        };
    } catch (err) {
        console.error('❌ get-receipts error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
