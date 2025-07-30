const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const params = event.queryStringParameters || {};
        const { metric, from, to } = params;

        let query = 'SELECT * FROM Analytics WHERE 1=1';
        const values = [];
        let index = 1;

        if (metric) {
            query += ` AND Metric = $${index++}`;
            values.push(metric);
        }

        if (from) {
            query += ` AND Timestamp >= $${index++}`;
            values.push(new Date(from));
        }

        if (to) {
            query += ` AND Timestamp <= $${index++}`;
            values.push(new Date(to));
        }

        query += ' ORDER BY Timestamp DESC';

        const result = await pool.query(query, values);
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows)
        };
    } catch (err) {
        console.error('❌ get-analytics error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
