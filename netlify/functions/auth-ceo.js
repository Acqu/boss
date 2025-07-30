// auth-ceo.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    let password;
    try {
        const data = JSON.parse(event.body || '{}');
        password = data.inputPassword?.trim(); // ✅ match Blazor field
        if (!password) {
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
        const result = await pool.query(
            'SELECT * FROM ceo_credentials WHERE password = $1',
            [password]
        );

        const isAuthenticated = result.rows.length === 1;

        return {
            statusCode: isAuthenticated ? 200 : 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(
                isAuthenticated
                    ? { success: true, message: 'Authenticated' }
                    : { success: false, message: 'Invalid password' }
            ),
        };
    } catch (error) {
        console.error('Query error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Server error', details: error.message }),
        };
    }
};