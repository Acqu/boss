const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        if (!data.metric || data.value === undefined || !data.timestamp) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }

        const query = `
      INSERT INTO AnalyticsEntries (Metric, Value, Source, Notes, Timestamp)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
        const values = [
            data.metric,
            data.value,
            data.source || '',
            data.notes || '',
            data.timestamp
        ];

        const result = await pool.query(query, values);
        return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
    } catch (err) {
        console.error('❌ add-analytics-entry error:', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
