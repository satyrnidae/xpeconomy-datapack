const { score, sel, tr, say, json } = require('./lib');

const mine = (key, fallback, objective) => json(tr(key, fallback, score('@s', objective)));
const hundreds = (key, fallback, ...lead) => json(tr(key, fallback, ...lead, score('#w', 'xpeco.tmp'), score('#f', 'xpeco.tmp')));

// Hundreds split into whole #w and a two digit fraction #f, and a fraction under ten needs the extra zero.
module.exports = {
  balanceText: {
    points: mine('xpeco.balance.points', 'Balance: %s points', 'xpeco.total'),
    levels: mine('xpeco.balance.levels', 'Balance: %s levels', 'xpeco.lvl'),
    nomatch: say('xpeco.balance.nomatch', 'That entity is not an online player.'),
    other: json(tr('xpeco.balance.other', '%s has a balance of: %s points (%s levels)', sel('@s'), score('@s', 'xpeco.total'), score('@s', 'xpeco.lvl'))),
    hundredLow: hundreds('xpeco.balance.hundred', 'Balance: %s.0%s hundreds'),
    hundred: hundreds('xpeco.balance.hundred', 'Balance: %s.%s hundreds'),
  },
};
