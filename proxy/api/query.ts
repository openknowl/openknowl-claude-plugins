import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== process.env.API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sql } = req.body;

  if (!sql || typeof sql !== 'string') {
    return res.status(400).json({ error: 'sql field required' });
  }

  if (!/^\s*SELECT\b/i.test(sql.trim())) {
    return res.status(400).json({ error: 'SELECT queries only' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const result = await client.query(sql);
    return res.status(200).json({ rows: result.rows });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
}
