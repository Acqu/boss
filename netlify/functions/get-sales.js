const pool = require('./db');

exports.handler = async function () {
    try {
        const result = await pool.query('SELECT * FROM Sales ORDER BY Timestamp DESC');
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows)
        };
    } catch (err) {
        console.error('❌ get-sales error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
