const pool = require('./db');

exports.handler = async function () {
    try {
        const result = await pool.query('SELECT NOW()');
        return {
            statusCode: 200,
            body: JSON.stringify({ timestamp: result.rows[0].now })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
