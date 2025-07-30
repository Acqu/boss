const { Client } = require('pg');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const { password } = JSON.parse(event.body || '{}');

    if (!password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing password' }),
        };
    }

    const client = new Client({
        connectionString: process.env.NETLIFY_DATABASE_URL, // Updated to align with other functions
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();

        const result = await client.query(
            'SELECT * FROM ceo_credentials WHERE password = $1',
            [password]
        );

        await client.end();

        if (result.rows.length === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'Authenticated' }),
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ success: false, message: 'Invalid password' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server error', details: error.message }),
        };
    }
};
