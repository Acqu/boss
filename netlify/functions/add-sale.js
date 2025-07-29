const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        if (!data.productId || !data.quantity || !data.unitPrice || !data.buyer) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }

        const query = `
      INSERT INTO Sales (ProductId, ProductName, Color, Type, Quantity, UnitPrice, Total, Timestamp, Buyer)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;
        const values = [
            data.productId,
            data.productName || '',
            data.color || '',
            data.type || '',
            data.quantity,
            data.unitPrice,
            data.total || data.quantity * data.unitPrice,
            data.timestamp || new Date().toISOString(),
            data.buyer
        ];

        const result = await pool.query(query, values);
        return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
    } catch (err) {
        console.error('❌ add-sale error:', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
