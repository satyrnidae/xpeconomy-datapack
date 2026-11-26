// Every objective the pack adds must be removed by xpeco:uninstall or a function in #xpeco:uninstall.
// Every tag the pack adds must be removed there too.
import fs from 'node:fs';
import path from 'node:path';

const fnRoot = 'data/xpeco/function';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.mcfunction') ? [path.join(d, e.name)] : []);

const id = (f) => 'xpeco:' + path.relative(fnRoot, f).split(path.sep).join('/').replace('.mcfunction', '');
const files = walk(fnRoot).map((f) => ({ id: id(f), lines: fs.readFileSync(f, 'utf8').split(/\r?\n/) }));
const tag = JSON.parse(fs.readFileSync('data/xpeco/tags/function/uninstall.json', 'utf8')).values;

const uninstallIds = new Set([...tag, 'xpeco:uninstall']);
const all = files.flatMap((f) => f.lines.map((l) => ({ id: f.id, l })));
const grab = (re, onlyUninstall) => new Set(all.filter((x) => !!onlyUninstall === uninstallIds.has(x.id)).map((x) => x.l.match(re)?.[1]).filter(Boolean));

const added = grab(/objectives add (\S+)/, false);
const removed = grab(/objectives remove (\S+)/, true);
// A tag removed again in the function that adds it is transient. A kill of tagged entities in uninstall counts as removal.
const tagOf = (re, l) => l.match(re)?.[1];
const transient = new Set(
  files.flatMap((f) => f.lines.map((l) => tagOf(/\btag @\S+ remove (\S+)/, l)).filter((t) => t && f.lines.some((l) => tagOf(/\btag @\S+ add (\S+)/, l) === t))),
);
const tagsAdded = new Set([...grab(/\btag @\S+ add (\S+)/, false)].filter((t) => !transient.has(t)));
const tagsRemoved = new Set([...grab(/\btag @\S+ remove (\S+)/, true), ...grab(/\bkill @e\[.*\btag=([^,\]]+)/, true)]);

const missing = [
  ...[...added].filter((o) => !removed.has(o)).map((o) => 'objective ' + o),
  ...[...tagsAdded].filter((t) => !tagsRemoved.has(t)).map((t) => 'tag ' + t),
];
console.log('objectives added:', added.size, 'removed:', removed.size);
console.log('tags added:', tagsAdded.size, 'removed:', tagsRemoved.size);
console.log(missing.length ? 'NOT REMOVED: ' + missing.join(', ') : 'all removed');
process.exit(missing.length ? 1 : 0);
