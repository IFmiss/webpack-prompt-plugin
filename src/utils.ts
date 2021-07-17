import fs from 'fs';
import { performance } from 'perf_hooks';

export function getPkg(): {
  [props: string]: unknown;
} {
  const pkg = fs.readFileSync('package.json').toString();
  return JSON.parse(pkg);
}

function time2Emoji(time: number): string {
  const t = time / 1000;
  if (t >= 20) {
    return '🐌';
  }
  if (t > 15) {
    return '🐢';
  }
  if (t > 10) {
    return '🛵';
  }
  if (t > 6) {
    return '🚂';
  }
  if (t > 4) {
    return '🚅';
  }
  if (t > 2) {
    return '🚀';
  }
  return '🛸 ⚡️⚡️⚡️';
}

export function time2M(t: number): [string, string] {
  const time = performance.now() - t;
  const str =
    time > 2000 ? `${(time / 1000).toFixed(2)}s` : `${time.toFixed(0)}ms`;
  return [str, time2Emoji(time)];
}
