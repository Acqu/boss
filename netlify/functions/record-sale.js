const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
});

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    try {
        const sale = JSON.parse(event.body);

        if (!sale.ProductId || !sale.Quantity || !sale.UnitPrice || !sale.Timestamp) {
            return {
                statusCode: 400,
                body: 'Missing required sale fields'
            };
        }

        const query = `
      INSERT INTO sales (product_id, product_name, color, type, quantity, unit_price, total, timestamp, buyer)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
        const values = [
            sale.ProductId,
            sale.ProductName,
            sale.Color,
            sale.Type,
            sale.Quantity,
            sale.UnitPrice,
            sale.Total,
            sale.Timestamp,
            sale.Buyer
        ];

        await pool.query(query, values);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Sale recorded successfully' })
        };
    } catch (error) {
        console.error('Error recording sale:', error);
        return {
            statusCode: 500,
            body: `Internal Server Error: ${error.message}`
        };
    }
};
