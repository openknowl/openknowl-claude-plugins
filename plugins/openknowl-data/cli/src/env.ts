// 읽기 전용 DB 계정. 개발팀이 발급한 값으로 교체 후 빌드.
// CREATE USER openknowl_readonly WITH PASSWORD '...';
// GRANT SELECT ON ALL TABLES IN SCHEMA public TO openknowl_readonly;
export const DB_URL = 'postgres://openknowl_readonly:ok_readonly_2025!@dev-openknowl-db.cwvj9lqfkyqc.ap-northeast-2.rds.amazonaws.com/dev_miniintern?ssl=true&sslmode=no-verify';
