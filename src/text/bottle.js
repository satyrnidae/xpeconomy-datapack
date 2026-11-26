const { score, tr, json } = require('./lib');

module.exports = {
  bottleText: {
    lowBalance: json(tr('xpeco.bottle.lowbalance', 'Not enough experience to fill a bottle, you need %s points.', score('#bottle', 'xpeco.tmp'))),
  },
};
