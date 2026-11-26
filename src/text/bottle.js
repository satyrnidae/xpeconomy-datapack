const { score, tr, json, say } = require('./lib');

// Lore lines, gray without the default italics, with the keys as gold keybinds in square brackets so the player sees
// their own bound keys. Both modes carry the same lines.
const key = (name) => ({ text: '[', color: 'gold', extra: [{ keybind: name }, { text: ']' }] });

module.exports = {
  bottleText: {
    lore: json([
      { ...tr('xpeco.bottle.lore.1', 'Press %s to throw. Hold', key('key.use')), color: 'gray', italic: false },
      { ...tr('xpeco.bottle.lore.2', '%s to consume instead.', key('key.sneak')), color: 'gray', italic: false },
    ]),
    modeThrowLore: json([{...tr('xpeco.bottle.lore.throw', 'Will be thrown'), color: 'blue', italic: true}]),
    modeDrinkLore: json([{...tr('xpeco.bottle.lore.drink', 'Will be consumed'), color: 'blue', italic: true}]),
    lowBalance: json(tr('xpeco.bottle.lowbalance', 'Not enough experience to fill a bottle, you need %s points.', score('#bottle', 'xpeco.tmp'))),
    modeThrow: json({...tr('xpeco.bottle.mode.throw', "Filled Bottle o' Enchanting will be thrown"), color: "gray"}),
    modeDrink: json({...tr('xpeco.bottle.mode.drink', "Filled Bottle o' Enchanting will be consumed"), color: "gray"})
  },
};
