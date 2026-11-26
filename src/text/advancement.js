const { tr, json } = require('./lib');

const colored = (component, color) => ({ ...component, color });

module.exports = {
  advText: {
    globalRoot: json(tr('global.advancement.root.title', 'Installed Datapacks')),
    authorTitle: json(tr('global.advancement.satyrnidae.title', 'satyrnidae')),
    authorDescription: json(tr('global.advancement.satyrnidae.description', 'Datapacks Created by satyrnidae!')),
    rootTitle: json(colored(tr('xpeco.advancement.root.title', 'Experience Economy'), 'green')),
    rootDescription: json(colored(tr('xpeco.advancement.root.description', 'Perform transactions using experience as currency!'), 'yellow')),
    tableInteractTitle: json(tr('xpeco.advancement.bottle.table.on_interact.title', 'Bottles Up!')),
    tableInteractDescription: json(tr('xpeco.advancement.bottle.table.on_interact.description', 'Sneak with a bottle at an enchantment table to fill it')),
    bottlethrowTitle: json(tr('xpeco.advancement.bottle.use.on_throw.title', 'Chuck It')),
    bottlethrowDescription: json(tr('xpeco.advancement.bottle.use.on_throw.description', 'Throw a filled experience bottle')),
    bottledrinkTitle: json(tr('xpeco.advancement.bottle.use.on_drink.title', 'Chug It')),
    bottledrinkDescription: json(tr('xpeco.advancement.bottle.use.on_drink.description', 'Drink a filled experience bottle'))
  },
};
