// get-sales.js
import { neon } from '@netlify/neon';
const sql = neon(); // Uses env NETLIFY_DATABASE_URL automatically

export const handler = async function () {
    try {
        const result = await sql`SELECT * FROM Sales ORDER BY Timestamp DESC`;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(result.rows), // ✅ return only rows
        };
    } catch (err) {
        console.error('❌ get-sales error:', err);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: err.message }),
        };
    }
};