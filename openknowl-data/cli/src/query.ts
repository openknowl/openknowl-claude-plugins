import { execSync } from 'child_process';
import { PROXY_URL, PROXY_TOKEN } from './env';

if (!PROXY_URL) {
  console.error('오류: openknowl-credentials.json 파일을 찾을 수 없습니다.');
  console.error('/openknowl-data:onboarding 스킬을 실행하여 설정 방법을 확인하세요.');
  process.exit(1);
}

const sql = process.argv[2];

if (!sql) {
  console.error('사용법: node dist/cli.js "SELECT ..."');
  process.exit(1);
}

// SELECT만 허용 — 프록시/DB 계정과 삼중 방어
if (!/^\s*SELECT\b/i.test(sql.trim())) {
  console.error('SELECT 쿼리만 허용됩니다.');
  process.exit(1);
}

async function run() {
  // Node.js fetch는 https_proxy를 무시하므로 curl 사용 (샌드박스 프록시 호환)
  const body = JSON.stringify({ sql });
  const result = execSync(
    `curl -s -X POST "${PROXY_URL}" -H "Content-Type: application/json" -H "X-Api-Token: ${PROXY_TOKEN}" -d @-`,
    { input: body, encoding: 'utf-8', timeout: 30000 },
  );
  const data = JSON.parse(result);
  if (data.error) throw new Error(data.error);
  console.log(JSON.stringify(data.rows, null, 2));
}

run().catch(err => {
  console.error('오류:', err.message);
  process.exit(1);
});
