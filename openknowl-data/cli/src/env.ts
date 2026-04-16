// DB URL은 환경변수로 주입. 관리자에게 OPENKNOWL_DB_URL 값을 요청하세요.
// export OPENKNOWL_DB_URL='postgres://...'
export const DB_URL = process.env.OPENKNOWL_DB_URL ?? '';
