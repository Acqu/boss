const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        if (!data.reference || !data.amount || !data.issuedOn) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }

        const query = `
      INSERT INTO Receipts (Reference, Amount, IssuedOn)
      VALUES ($1, $2, $3)
      RETURNING *`;
        const values = [data.reference, data.amount, data.issuedOn];

        const result = await pool.query(query, values);
        return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
    } catch (err) {
        console.error('❌ add-receipt error:', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
