import { neon } from '@netlify/neon';
const sql = neon(); // Uses env NETLIFY_DATABASE_URL automatically

export const handler = async (event) => {
  const postId = event.queryStringParameters?.id;
  if (!postId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing post id' }) };
  }
  try {
    const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
    return { statusCode: 200, body: JSON.stringify(post) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};