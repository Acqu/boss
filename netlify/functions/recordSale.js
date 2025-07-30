// netlify/functions/recordSale.js
const pool = require('./db').default;

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    let sale;
    try {
        sale = JSON.parse(event.body || '{}');
        if (!sale.id || !sale.productId || !sale.quantity || !sale.timestamp) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing sale fields' }),
            };
        }
    } catch (err) {
        console.error('Failed to parse sale:', err);
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Invalid JSON format' }),
        };
    }

    try {
        await pool.query(
            'INSERT INTO "Sales" (id, productId, quantity, timestamp) VALUES ($1, $2, $3, $4)',
            [sale.id, sale.productId, sale.quantity, sale.timestamp]
        );

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error('❌ recordSale error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Server error', details: error.message }),
        };
    }
};
