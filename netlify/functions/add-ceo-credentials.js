const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        if (!data.password) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Password is required' }) };
        }

        const query = `
      INSERT INTO CeoCredentials (Password)
      VALUES ($1)
      RETURNING *`;
        const values = [data.password];

        const result = await pool.query(query, values);
        return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
    } catch (err) {
        console.error('❌ add-ceo-credentials error:', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
