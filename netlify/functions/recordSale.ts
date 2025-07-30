// netlify/functions/recordSale.ts
import pool from './db';

export async function handler(event) {
    const sale = JSON.parse(event.body);

    await pool.query(
        'INSERT INTO "Sales" (id, productId, quantity, timestamp) VALUES ($1, $2, $3, $4)',
        [sale.id, sale.productId, sale.quantity, sale.timestamp]
    );

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
    };
}
