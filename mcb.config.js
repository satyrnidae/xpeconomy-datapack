module.exports = {
    generatedDirName: '__generated__',
    formatVersion: 121,
    internalScoreboardName: 'xpeco.cfg',
    eqVarScoreboardName: 'xpeco.eq.var',
    eqConstScoreboardName: 'xpeco.eq.const',
    header: '# Experience Economy datapack\n# Built using mc-build (https://github.com/mc-build/mc-build)',
    // Pack settings for the sources, read through src/config.js. mc-build ignores this key.
    settings: {
        version: '0.1.0',
        packName: 'xpeconomy-dp',
        // Request lifetime in ticks, 600 is 30 seconds
        expireTicks: 600,
        // Pay target ray, in 0.25 block steps
        rayStepCount: 20,
        bottlePoints: 7,
        bottleReachSteps: 13,
        dropAllOnDeath: false,
        deathShowerTicks: 20
    }
};
