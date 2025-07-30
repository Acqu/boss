import { neon } from '@netlify/neon';
const sql = neon();

export const handler = async function () {
    try {
        const result = await sql`SELECT * FROM Sales ORDER BY Timestamp DESC`;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(result.rows), // ✅ Only rows 
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