const pool = require('./db');

exports.handler = async function () {
    try {
        const result = await pool.query('SELECT * FROM Products ORDER BY Id DESC');
        return { statusCode: 200, body: JSON.stringify(result.rows) };
    } catch (err) {
        console.error('❌ get-products error:', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
