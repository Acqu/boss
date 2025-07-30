const pool = require('./db');

exports.handler = async function () {
    try {
        const result = await pool.query('SELECT username, password FROM ceocredential LIMIT 1');
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows[0])
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
