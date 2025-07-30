// netlify/functions/login.ts
import pool from './db';

export async function handler(event) {
    const { inputPassword } = JSON.parse(event.body);

    const res = await pool.query('SELECT password FROM "CeoCredentials" LIMIT 1');
    const storedPassword = res.rows[0]?.password;

    const isValid = storedPassword?.trim() === inputPassword?.trim();

    return {
        statusCode: 200,
        body: JSON.stringify({ success: isValid })
    };
}
