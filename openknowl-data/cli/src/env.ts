import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

function getDbUrl(): string {
  // 1순위: 환경변수 (Claude Code CLI가 settings.json env 필드를 주입)
  if (process.env.OPENKNOWL_DB_URL) return process.env.OPENKNOWL_DB_URL;

  // 2순위: settings.json 직접 읽기 (Cowork는 env 필드를 자동 주입하지 않음)
  try {
    const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    return settings?.env?.OPENKNOWL_DB_URL ?? '';
  } catch {
    return '';
  }
}

export const DB_URL = getDbUrl();
