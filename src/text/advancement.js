const { tr, json } = require('./lib');

const colored = (component, color) => ({ ...component, color });

module.exports = {
  advText: {
    globalRoot: json(tr('global.advancement.root.title', 'Installed Datapacks')),
    authorTitle: json(tr('global.advancement.satyrnidae.title', 'satyrnidae')),
    authorDescription: json(tr('global.advancement.satyrnidae.description', 'Datapacks Created by satyrnidae!')),
    rootTitle: json(colored(tr('xpeco.advancement.root.title', 'Experience Economy'), 'green')),
    rootDescription: json(colored(tr('xpeco.advancement.root.description', 'Perform transactions using experience as currency!'), 'yellow')),
  },
};
