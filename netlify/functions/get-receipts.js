const pool = require('./db');

exports.handler = async function () {
    try {
        const result = await pool.query('SELECT * FROM Receipts ORDER BY IssuedOn DESC');
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows)
        };
    } catch (err) {
        console.error('❌ get-receipts error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
