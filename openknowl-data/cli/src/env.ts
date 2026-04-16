// Vercel 프록시 설정 — 배포 후 실제 값으로 교체 후 npm run build
export const PROXY_URL = 'https://openknowl-db-proxy.vercel.app/api/query';
export const PROXY_TOKEN = '50cea6e1bbf15cd40137a442783a55ef';

// 직접 연결 폴백 (CLI 환경용)
export const DB_URL = process.env.OPENKNOWL_DB_URL ?? '';
