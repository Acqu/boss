const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'PUT') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        if (!data.id || !data.name || !data.price || !data.category) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }

        const query = `
      UPDATE Products
      SET Name = $1, Price = $2, Category = $3
      WHERE Id = $4
      RETURNING *`;
        const values = [data.name, data.price, data.category, data.id];

        const result = await pool.query(query, values);
        return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
    } catch (err) {
        console.error('❌ update-product error:', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
