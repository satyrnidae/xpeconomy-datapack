const { score, tr, json, say } = require('./lib');

module.exports = {
  bottleText: {
    lowBalance: json(tr('xpeco.bottle.lowbalance', 'Not enough experience to fill a bottle, you need %s points.', score('#bottle', 'xpeco.tmp'))),
    modeThrow: say('xpeco.bottle.mode.throw', "Filled Bottle o' Enchanting will be thrown"),
    modeDrink: say('xpeco.bottle.mode.drink', "Filled Bottle o' Enchanting will be consumed"),
  },
};
