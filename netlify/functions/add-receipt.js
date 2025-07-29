import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { reference, amount, issuedOn } = data;

        if (!reference || !amount || !issuedOn) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields: reference, amount, issuedOn' })
            };
        }

        const query = `
      INSERT INTO receipts (reference, amount, issuedon)
      VALUES ($1, $2, $3)
      RETURNING id, reference, amount, issuedon`;
        const values = [reference, amount, issuedOn];

        const result = await pool.query(query, values);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Receipt added successfully',
                receipt: result.rows[0]
            })
        };
    } catch (err) {
        console.error('❌ add-receipt error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
