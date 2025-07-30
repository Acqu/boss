import { neon } from '@netlify/neon';
const sql = neon();

export const handler = async function () {
    try {
        const [row] = await sql`SELECT NOW() as now`;
        return {
            statusCode: 200,
            body: JSON.stringify({ timestamp: row.now })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
