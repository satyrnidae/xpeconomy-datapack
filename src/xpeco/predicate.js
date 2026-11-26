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

module.exports = { nonzero };
