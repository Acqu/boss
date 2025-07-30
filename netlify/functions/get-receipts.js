// netlify/functions/get-receipts.js
const pool = require('./db').default; // ✅ Import default from TypeScript module

exports.handler = async function (event) {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        const query = `
            SELECT id, reference, amount, issuedon
            FROM receipts
            ORDER BY issuedon DESC`;

        const result = await pool.query(query);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: 'Receipts retrieved successfully',
                receipts: result.rows,
            }),
        };
    } catch (err) {
        console.error('❌ get-receipts error:', err);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
