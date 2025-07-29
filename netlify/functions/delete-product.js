const pool = require('./db');
const url = require('url');

exports.handler = async function (event) {
    if (event.httpMethod !== 'DELETE') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const queryParams = url.parse(event.url || event.rawUrl || '', true).query;
        const productId = parseInt(queryParams.id);

        if (!productId) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Product ID is required' }) };
        }

        const query = `DELETE FROM Products WHERE Id = $1 RETURNING *`;
        const result = await pool.query(query, [productId]);

        if (result.rowCount === 0) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Product not found' }) };
        }

        return { statusCode: 200, body: JSON.stringify({ success: true, deleted: result.rows[0] }) };
    } catch (err) {
        console.error('❌ delete-product error:', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
