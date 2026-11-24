// Runs the vanilla-backed checks against the built pack: PackLoad (registries load), CmdCheck (every command parses, pack
// ids resolve) and Scan (loot tables, predicates, item modifiers, advancements keep every key, so a key from before 26.3
// that the game drops silently fails here). They need the 26.3 client jar, its libraries and the compiled PackLoad and
// Scan classes from the foxcraft-dungeon-loot-2 harness cache, and Java 25.
// HARNESS_CACHE overrides the cache folder; JAVA_HOME picks the JDK.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cache = process.env.HARNESS_CACHE ?? 'D:\\satyrnidae\\minecraft\\datapacks\\foxcraft-dungeon-loot-2\\tests\\.cache';
const jdk = process.env.JAVA_HOME ?? '';
const exe = (n) => (jdk ? path.join(jdk, 'bin', n) : n);
const pack = process.cwd();

const libs = fs.readdirSync(path.join(cache, 'libs')).filter((f) => f.endsWith('.jar')).map((f) => path.join(cache, 'libs', f));
const base = [path.join(cache, 'mc', '26.3', '26.3.jar'), ...libs];
const sep = path.delimiter;

// CmdCheck lives in this repo, so compile it fresh. PackLoad and Scan come precompiled from the cache.
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'xpeco-check-'));
execFileSync(exe('javac'), ['-cp', base.join(sep), '-d', out, path.join('src', 'scripts', 'CmdCheck.java')], { stdio: 'inherit' });

const run = (cls, args, extra) => {
  console.log(`\n== ${cls}`);
  try {
    execFileSync(exe('java'), ['-cp', [...extra, ...base].join(sep), cls, ...args], { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
};

const cached = path.join(cache, 'classes');
const ok = [
  run('PackLoad', [pack], [cached]),
  run('CmdCheck', [pack, pack], [out]),
  run('Scan', [path.join(pack, 'data')], [cached]),
].every(Boolean);

fs.rmSync(out, { recursive: true, force: true });
process.exit(ok ? 0 : 1);
