const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        if (!data.name || !data.price || !data.category) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }

        const query = `
      INSERT INTO Products (Name, Price, Category, Created_At)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
        const values = [data.name, data.price, data.category, new Date().toISOString()];

        const result = await pool.query(query, values);
        return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
    } catch (err) {
        console.error('❌ add-product error:', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
