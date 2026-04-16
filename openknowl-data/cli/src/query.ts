import { Client } from 'pg';
import { DB_URL } from './env';

if (!DB_URL) {
  console.error('오류: OPENKNOWL_DB_URL이 설정되지 않았습니다.');
  console.error('/openknowl-data:onboarding 스킬을 실행하여 DB URL을 설정하세요.');
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

async function run() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    const result = await client.query(sql);
    // Claude가 파이프라인으로 가공할 수 있도록 JSON 출력
    console.log(JSON.stringify(result.rows, null, 2));
  } finally {
    await client.end();
  }
}

run().catch(err => {
  console.error('오류:', err.message);
  process.exit(1);
});
