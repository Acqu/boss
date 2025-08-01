﻿const pool = require('./db');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        const { reference, amount, issuedOn } = data;

        if (!reference || typeof amount !== 'number' || !issuedOn) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid fields: reference, amount, issuedOn' })
            };
        }

        const query = `
            INSERT INTO Receipts (Reference, Amount, IssuedOn)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const values = [reference, amount, issuedOn];

        const result = await pool.query(query, values);
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows[0])
        };
    } catch (err) {
        console.error('❌ save-receipt error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
