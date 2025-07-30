const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { username = 'admin', password } = data;

        if (!password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Password is required' })
            };
        }

        const query = `
      INSERT INTO ceocredential (username, password)
      VALUES ($1, $2)
      RETURNING id, username`;
        const values = [username, password];

        const result = await pool.query(query, values);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'CEO credentials added successfully',
                user: result.rows[0]
            })
        };
    } catch (err) {
        console.error('❌ add-ceo-credentials error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};