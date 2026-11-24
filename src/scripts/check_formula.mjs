// Mirrors total/{low,mid,high} in int32 and compares against the plugin's PlayerXPUtils.getXPForLevel.
// Plugin math is done on doubled values so the half-up rounding stays exact.
const pack = (L) => {
  if (L <= 16) return L * L + 6 * L;
  if (L <= 31) return Math.trunc((5 * L * L - 81 * L + 720) / 2);
  return Math.trunc((9 * L * L - 325 * L + 4440) / 2);
};

const plugin = (L) => {
  let twice;
  if (L <= 16) twice = 2 * L * L + 12 * L;
  else if (L <= 31) twice = 5 * L * L - 81 * L + 720;
  else twice = 9 * L * L - 325 * L + 4440;
  return Math.floor((twice + 1) / 2);
};

const bad = [];
for (let L = 0; L < 15000; L++) if (pack(L) !== plugin(L)) bad.push(L);
console.log('levels checked: 15000, mismatches:', bad.slice(0, 5));
console.log('L30 =', pack(30), 'L16 =', pack(16), 'L32 =', pack(32));

let over = 32;
while (9 * over * over <= 2 ** 31 - 1) over++;
console.log('first level where 9*L^2 overflows int32:', over);
process.exit(bad.length ? 1 : 0);
