// netlify/functions/login.js
const pool = require('./db').default; // ✅ Import from db.ts

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    let inputPassword;
    try {
        const data = JSON.parse(event.body || '{}');
        inputPassword = data.inputPassword?.trim();
        if (!inputPassword) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing password' }),
            };
        }
    } catch (err) {
        console.error('Failed to parse body:', err);
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Invalid JSON format' }),
        };
    }

    try {
        const res = await pool.query('SELECT password FROM "CeoCredentials" LIMIT 1');
        const storedPassword = res.rows[0]?.password?.trim();

        const isValid = storedPassword === inputPassword;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ success: isValid }),
        };
    } catch (error) {
        console.error('Login query error:', error);
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