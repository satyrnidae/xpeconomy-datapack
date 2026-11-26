module.exports = {
    generatedDirName: '__generated__',
    formatVersion: 121,
    internalScoreboardName: 'xpeco.cfg',
    eqVarScoreboardName: 'xpeco.eq.var',
    eqConstScoreboardName: 'xpeco.eq.const',
    header: '# Experience Economy datapack\n# Built using mc-build (https://github.com/mc-build/mc-build)',
    // Pack settings for the sources, read through src/config.js. mc-build ignores this key.
    settings: {
        version: '0.1.1',
        packName: 'xpeconomy-dp',
        // Request lifetime in ticks, 600 is 30 seconds
        expireTicks: 600,
        // Pay target ray, in 0.25 block steps
        rayStepCount: 20,
        bottlePoints: 7,
        bottleReachSteps: 13,
        // Speed of a thrown bottle in blocks per tick, a vanilla experience bottle is 0.7
        bottleThrowSpeed: 0.7,
        dropAllOnDeath: false,
        deathShowerTicks: 20,
        // Largest share per tick of the death shower that is split into random orbs, a bigger one is a single orb. 1 or more.
        deathLumpPoints: 64,
        // fillAmount special values: one level's worth of points, and all of the player's XP
        fillLevel: -1,
        fillAll: -2,
        // Score of an idle fillAmount trigger, so a set 0 shows as a change. The used selector starts one above it.
        idleMarker: -2147483648,
        // Seconds each of the two table hints shows. 20 ticks times this has to be a multiple of hintRefreshTicks.
        hintSeconds: 4,
        // How often the action bar is sent again while the player keeps looking, it fades after about 3 seconds
        hintRefreshTicks: 40
    }
};
