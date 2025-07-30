import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export const handler = async (event) => {
  const postId = event.queryStringParameters?.id;
  if (!postId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing post id' }) };
  }
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};