// netlify/functions/saveReceipt.ts
import pool from './db';

export async function handler(event) {
    const receipt = JSON.parse(event.body);

    await pool.query(
        'INSERT INTO "Receipts" (id, customerName, totalAmount, timestamp) VALUES ($1, $2, $3, $4)',
        [receipt.id, receipt.customerName, receipt.totalAmount, receipt.timestamp]
    );

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
    };
}
