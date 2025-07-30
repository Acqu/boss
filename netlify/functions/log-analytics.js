const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const { metric, value, timestamp } = data;

        if (!metric || typeof value !== 'number' || !timestamp) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid fields: metric, value, timestamp' })
            };
        }

        const query = `
            INSERT INTO Analytics (Metric, Value, Timestamp)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const values = [metric, value, timestamp];

        const result = await pool.query(query, values);
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows[0])
        };
    } catch (err) {
        console.error('❌ log-analytics error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
