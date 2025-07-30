// test-db.js
const pool = require('./db'); // expects ./db.js to export a Pool instance

exports.handler = async function () {
    try {
        const result = await pool.query('SELECT NOW() as now');
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timestamp: result.rows[0].now })
        };
    } catch (err) {
        console.error('DB query error:', err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: err.message })
        };
    }
};
