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
    pointsLore: json([{...tr('xpeco.bottle.lore.points', 'Filled with %s points', { text: '', color: 'green', extra: [{ nbt: 'points', storage: 'xpeco:tmp', plain: true }] }), color: 'blue', italic: true}]),
    amountSet: json(tr('xpeco.bottle.amount.set', 'Your filled bottles now hold %s points.', score('@s', 'xpeco.fill'))),
    amountLevel: json(tr('xpeco.bottle.amount.level', 'Your filled bottles now hold what it takes to finish a level.')),
    amountAll: json(tr('xpeco.bottle.amount.all', 'Your filled bottles now hold all of your experience.')),
    amountCleared: json(tr('xpeco.bottle.amount.cleared', 'Your filled bottles hold the default, %s points.', score('#price', 'xpeco.tmp'))),
    fillHint: json({ ...tr('xpeco.bottle.hint', 'Bottle will be filled with %s experience points', { ...score('#hint', 'xpeco.tmp'), color: 'green' }), color: 'gray' }),
    fillHintCmd: json({ ...tr('xpeco.bottle.hint.command', 'Change the amount with %s', { text: '/trigger fillAmount set <value>', color: 'aqua' }), color: 'gray' }),
    lowBalance: json(tr('xpeco.bottle.lowbalance', 'Not enough experience. You need %s experience to fill a bottle; you currently have %s. You can set your fill amount with %s',
      { ...score('#bottle', 'xpeco.tmp'), color: 'green' },
      { ...score('@s', 'xpeco.total'), color: 'green' },
      { text: '/trigger fillAmount set <value>', color: 'aqua', click_event: { action: 'suggest_command', command: '/trigger fillAmount set $(total)' } })),
    modeThrow: json({...tr('xpeco.bottle.mode.throw', "Filled Bottle o' Enchanting will be thrown"), color: "gray"}),
    modeDrink: json({...tr('xpeco.bottle.mode.drink', "Filled Bottle o' Enchanting will be consumed"), color: "gray"})
  },
};
