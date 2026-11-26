// Objectives of a thrown bottle's tracker, position and speed in thousandths of a block per axis
module.exports = {
  traceObjectives: ['px', 'py', 'pz', 'vx', 'vy', 'vz'].map((a) => `xpeco.trace_${a}`),
};
