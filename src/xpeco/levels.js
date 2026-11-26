// Points a level costs to finish, in the three vanilla tiers: 2L + 7 up to 15, 5L - 38 for 16 to 30, 9L - 158 from 31.
// Shared by total.mcb, for the progress points, and bottle.mcb, for one level's worth.
const levelTiers = [
  { name: 'low', range: '..15', a: 2, b: 7 },
  { name: 'mid', range: '16..30', a: 5, b: -38 },
  { name: 'high', range: '31..', a: 9, b: -158 },
];

// The cost as an eq expression for a level held in the score `level`, written score first so the sign stays right.
const cost = (tier, level) => `${level} * ${tier.a} ${tier.b < 0 ? '-' : '+'} ${Math.abs(tier.b)}`;

module.exports = { levelTiers, cost };
