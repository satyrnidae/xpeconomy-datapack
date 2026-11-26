// Predicates built from data. A selector scores range cannot say "not zero", and a predicate with any_of can, so one
// predicate selects a player whose score on any of the objectives is not zero in a single pass. Players without the
// score do not match.
const score = (objective, range) => ({
  type: 'minecraft:entity_scores',
  entity: 'this',
  scores: { [objective]: range },
});

// A predicate block supplies its own braces, so the object comes back without its outer pair.
const nonzero = (objectives) =>
  JSON.stringify({
    type: 'minecraft:any_of',
    terms: objectives.flatMap((o) => [score(o, { min: 1 }), score(o, { max: -1 })]),
  }).slice(1, -1);

// A filled bottle in one hand, optionally of one mode, as a predicate term.
const heldTerm = (hand, mode) => ({
  type: 'minecraft:entity_properties',
  entity: 'this',
  predicate: {
    'minecraft:equipment': {
      [hand]: {
        items: 'minecraft:poisonous_potato',
        predicates: { 'minecraft:custom_data': `{"xpeco:bottle":1b${mode ? `,mode:"${mode}"` : ''}}` },
      },
    },
  },
});

// One hand, bare. Same brace rule as nonzero.
const heldBottle = (hand, mode) => JSON.stringify(heldTerm(hand, mode)).slice(1, -1);

// A player with a filled bottle in either hand
const holdingBottle = () =>
  JSON.stringify({ type: 'minecraft:any_of', terms: ['mainhand', 'offhand'].map((hand) => heldTerm(hand)) }).slice(1, -1);

// The score is any of the given values, each a number or a {min, max} range
const scoreAny = (objective, values) =>
  JSON.stringify({
    type: 'minecraft:any_of',
    terms: values.map((v) => score(objective, v)),
  }).slice(1, -1);

module.exports = { nonzero, holdingBottle, heldBottle, scoreAny };
