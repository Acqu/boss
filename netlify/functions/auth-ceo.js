// auth-ceo.js
const { Client } = require('pg');

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
        password = data.password;
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

    const client = new Client({
        connectionString: process.env.NETLIFY_DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        const result = await client.query(
            'SELECT * FROM ceo_credentials WHERE password = $1',
            [password]
        );

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                result.rows.length === 1
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
    } finally {
        await client.end().catch(err => console.error('Failed to close DB:', err));
    }
};