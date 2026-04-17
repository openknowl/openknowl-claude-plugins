import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';

const CREDS_FILE = 'openknowl-credentials.json';

interface Creds {
  PROXY_URL?: string;
  PROXY_TOKEN?: string;
}

function tryLoad(path: string): Creds | null {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, 'utf8')) as Creds;
  } catch {
    return null;
  }
}

function searchUpward(start: string): Creds | null {
  let dir = start;
  while (true) {
    const found = tryLoad(join(dir, CREDS_FILE));
    if (found) return found;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

// Cowork 샌드박스: /sessions/<id>/mnt/<프로젝트>/openknowl-credentials.json
function searchCoworkMounts(): Creds | null {
  try {
    for (const session of readdirSync('/sessions')) {
      const mntDir = join('/sessions', session, 'mnt');
      if (!existsSync(mntDir)) continue;
      for (const project of readdirSync(mntDir)) {
        const found = tryLoad(join(mntDir, project, CREDS_FILE));
        if (found) return found;
      }
    }
  } catch {}
  return null;
}

function loadCreds(): Creds {
  const projectDir = process.env.CLAUDE_PROJECT_DIR;
  if (projectDir) {
    const found = tryLoad(join(projectDir, CREDS_FILE));
    if (found) return found;
  }
  return searchUpward(process.cwd()) ?? searchCoworkMounts() ?? {};
}

const creds = loadCreds();

export const PROXY_URL = creds.PROXY_URL ?? '';
export const PROXY_TOKEN = creds.PROXY_TOKEN ?? '';
