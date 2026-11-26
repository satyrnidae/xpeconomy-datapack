const mcb = require('../mcb.config.js');

module.exports = {
  config: mcb.settings,
  // eq objectives this pack renamed in mcb.config.js. Only those are ours to remove, the mcb defaults may be shared.
  eqObjectives: [mcb.eqVarScoreboardName, mcb.eqConstScoreboardName].filter(Boolean),
};
