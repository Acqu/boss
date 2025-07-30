// netlify/functions/saveReceipt.js
const pool = require('./db').default;

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    let receipt;
    try {
        receipt = JSON.parse(event.body || '{}');
        if (!receipt.id || !receipt.customerName || !receipt.totalAmount || !receipt.timestamp) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing receipt fields' }),
            };
        }
    } catch (err) {
        console.error('Failed to parse receipt:', err);
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Invalid JSON format' }),
        };
    }

    try {
        await pool.query(
            'INSERT INTO "Receipts" (id, customerName, totalAmount, timestamp) VALUES ($1, $2, $3, $4)',
            [receipt.id, receipt.customerName, receipt.totalAmount, receipt.timestamp]
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
        console.error('❌ saveReceipt error:', error);
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
