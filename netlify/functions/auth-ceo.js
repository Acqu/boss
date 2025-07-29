const { Client } = require('pg');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const { username, password } = JSON.parse(event.body || '{}');

    if (!username || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing username or password' }),
        };
    }

    const client = new Client({
        connectionString: process.env.POSTGRES_URL, // Make sure this is set in Netlify env vars
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();

        const result = await client.query(
            'SELECT * FROM ceo_credentials WHERE username = $1 AND password = $2',
            [username, password]
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
                body: JSON.stringify({ success: false, message: 'Invalid credentials' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server error', details: error.message }),
        };
    }
};
