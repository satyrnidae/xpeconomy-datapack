const { bottleText } = require('../../text/bottle');

// The item modifiers of a filled bottle as JSON strings. fill is the loot table modifier, the only one that writes the
// whole lore: the key lines, the points the bottle was filled with, then the mode line. The mode swaps replace the mode
// line only, the fourth, offset 3, so the points line stays. custom_data goes through SNBT so the flag stays a byte.
const parse = (text) => JSON.parse(text);

const base = {
  'minecraft:item_model': 'minecraft:experience_bottle',
  'minecraft:enchantment_glint_override': true,
  'minecraft:item_name': { translate: 'xpeco.bottle.name', fallback: "Filled Bottle o' Enchanting" },
  'minecraft:rarity': 'common',
};

// Consumed one tick after use, no animation, no burp. The burp comes from the food component alone.
const throwComponents = {
  '!minecraft:food': {},
  '!minecraft:use_remainder': {},
  'minecraft:consumable': {
    consume_seconds: 0.05,
    animation: 'none',
    sound: 'minecraft:entity.experience_bottle.throw',
    has_consume_particles: false,
  },
};

// The default 1.6 second drink without particles. consume_seconds is left out, Scan flags a field written at its default.
const drinkComponents = {
  'minecraft:use_remainder': { id: 'minecraft:glass_bottle' },
  'minecraft:food': { nutrition: 0, saturation: 0.0, can_always_eat: true },
  'minecraft:consumable': {
    animation: 'drink',
    sound: 'minecraft:entity.generic.drink',
    has_consume_particles: false,
  },
};

const components = (extra) => ({ type: 'minecraft:set_components', components: { ...base, ...extra } });
const data = (mode) => ({ type: 'minecraft:set_custom_data', tag: `{"xpeco:bottle":1b,mode:"${mode}"}` });
const appendLore = (lore, entity) => ({ type: 'minecraft:set_lore', lore, mode: 'append', ...(entity ? { entity: 'this' } : {}) });
const replaceModeLine = (lore) => ({ type: 'minecraft:set_lore', lore, mode: 'replace_section', offset: 3, size: 1 });
const sequence = (functions) => JSON.stringify(functions, null, 4);

// Points come from storage xpeco:tmp, set by fill just before the loot table is rolled
const copyPoints = {
  type: 'minecraft:copy_custom_data',
  source: { type: 'minecraft:storage', source: 'xpeco:tmp' },
  ops: [{ source: 'points', target: 'points', op: 'replace' }],
};

module.exports = {
  modes: {
    fill: sequence([
      copyPoints,
      components({ ...throwComponents, 'minecraft:lore': parse(bottleText.lore) }),
      appendLore(parse(bottleText.pointsLore), true),
      appendLore(parse(bottleText.modeThrowLore)),
      data('throw'),
    ]),
    // A bottle from before the points were stored: the points and the lore line, which goes between the key lines and the mode
    legacy: sequence([
      copyPoints,
      { type: 'minecraft:set_lore', lore: parse(bottleText.pointsLore), mode: 'replace_section', offset: 2, size: 0, entity: 'this' },
    ]),
    throw: sequence([components(throwComponents), replaceModeLine(parse(bottleText.modeThrowLore)), data('throw')]),
    drink: sequence([components(drinkComponents), replaceModeLine(parse(bottleText.modeDrinkLore)), data('drink')]),
  },
};
