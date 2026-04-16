import { Client } from 'pg';
import { DB_URL, PROXY_URL, PROXY_TOKEN } from './env';

if (!DB_URL && !PROXY_URL) {
  console.error('오류: DB 연결 정보가 설정되지 않았습니다.');
  console.error('/openknowl-data:onboarding 스킬을 실행하여 설정하세요.');
  process.exit(1);
}

const sql = process.argv[2];

if (!sql) {
  console.error('사용법: node dist/cli.js "SELECT ..."');
  process.exit(1);
}

// SELECT만 허용 — 읽기 전용 DB 계정과 이중으로 방어
if (!/^\s*SELECT\b/i.test(sql.trim())) {
  console.error('SELECT 쿼리만 허용됩니다.');
  process.exit(1);
}

async function runViaProxy() {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PROXY_TOKEN}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as any).error || `HTTP ${res.status}`);
  }

  const data = await res.json() as { rows: unknown[] };
  console.log(JSON.stringify(data.rows, null, 2));
}

async function runDirect() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    const result = await client.query(sql);
    console.log(JSON.stringify(result.rows, null, 2));
  } finally {
    await client.end();
  }
}

// PROXY_URL이 있으면 프록시 경유, 없으면 직접 연결
const run = PROXY_URL ? runViaProxy : runDirect;

run().catch(err => {
  console.error('오류:', err.message);
  process.exit(1);
});
