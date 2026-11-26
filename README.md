# xpeconomy-dp

*TODO: reword and streamline this generated draft*

Plugin-free XP currency for Minecraft 26.3, built with mc-build. Balance is live XP, so there is no separate ledger.

## AI use disclosure

This pack was written with Claude Code, Anthropic's coding assistant, as a conversion of the xpeconomy Paper plugin. The assistant drafted the sources, the checks, this README and the commit messages. Every file was reviewed by the author before it was committed, and commits made with the assistant carry a Co-Authored-By trailer. The static checks under Build and check pass, but in-game behavior was tested by the author by hand, not by an automated suite.

## Commands

Players use `/trigger`, since datapack functions need permission level 2. The two chat button triggers carry the xpeco.
prefix so they stay out of the way of players typing commands, they are meant to be clicked from a request.

| Command | Does |
|---|---|
| `/trigger balance` | Prints your balance in the configured mode |
| `/trigger pay set <amount>` | Pays the player you are looking at, or lists every account to pick from when nobody is in the crosshair. Either way it asks to confirm first, with a button to pick someone else instead, and the prompt expires after 30 seconds |
| `/trigger request set <amount>` | Asks the player you are looking at, or lists the players who are online to pick from when nobody is in the crosshair. The request has chat buttons and expires after 30 seconds |
| `/trigger xpeco.accept_charges` | Pays a pending request, run by the chat button |
| `/trigger xpeco.decline_payment` | Declines a pending request, run by the chat button |
| `/trigger xpeco.pay_to set <id>` | Picks an account from the pay list, run by the chat button |
| `/trigger xpeco.pay_page set <n>` | Shows a page of the pay list, 15 names a page in three columns |
| `/trigger xpeco.req_to set <id>` | Picks an online player from the request list, run by the chat button |
| `/trigger xpeco.req_page set <n>` | Shows a page of the request list |
| `/trigger xpeco.pay_confirm` | Sends the pending payment, run by the chat button |
| `/trigger xpeco.pay_deny` | Cancels the pending payment, run by the chat button |

Bottles: sneak with a glass bottle in the main hand and right-click an enchanting table within 3 blocks. Costs
`bottlePoints` XP and a glass bottle, creative is free. The filled bottle is a custom item with two modes, shown on the action bar. Standing, it is thrown and returns exactly `bottlePoints` as orbs where it lands. Sneaking, it is consumed and adds `bottlePoints` to you.

## Ops

- Permissions: none. Every player can use every trigger. There are no exempt players and no op-only defaults.
- Admin add, deduct, set: use the builtin `/experience`.
- Config reload: `/reload`, settings come from `mcb.config.js` at build time.
- Display mode: `/scoreboard players set #mode xpeco.cfg <0|1|2>`, points, levels, per hundred.
- Balance of another player: `/function xpeco:balance/of with entity Steve`, any selector for one player, online players only.
- Accounts: every player gets a number and a stored name on first tick online with the pack, kept in `xpeco:accounts`. The pay list shows these, offline players included, and a payment to an offline account goes through the pending ledger. A renamed player is updated on their next rejoin, and credits waiting under the old name move to the new one. Each list entry is `[head name]` with the player head, in the color of their locator bar icon: an explicit icon color if set, else the UUID-derived default the client uses. Team colors are not read, and the color is stored once, so a later change to the icon color does not show. Only the entry is clickable, not the gap after it.
- Drop all experience on death: `/scoreboard players set #deathdrop xpeco.cfg 1` turns it on, 0 off. The first load takes the value from `dropAllOnDeath` in `mcb.config.js`. Vanilla drops 7 points a level up to 100 and keepInventory drops none; this adds the rest of the total as the same random-split orbs the bottles use, showered out over `deathShowerTicks` ticks (20) from a marker at the death spot and, with keepInventory on, zeroes the player so the respawn cannot return it. Spectators are skipped.
- Pay by name, online or offline: `/function xpeco:pay/to_name {to:"Name",amount:5}`, needs permission level 2.
- Uninstall: `/function xpeco:uninstall`, removes objectives and tags, then disables the pack.

## Build and check

```
npm install
npm run build
npm run check
```

`check` builds, then runs the level formula and uninstall checks, then PackLoad, CmdCheck and Scan from the 26.3 client jar.
The Java checks need Java 25 and the harness cache from foxcraft-dungeon-loot-2, see `src/scripts/check_game.mjs`.

Chat text is not written inline in the `.mcb` sources. Each component lives in `src/text/*.js`, built from the helpers in `src/text/lib.js` such as `button`, `tr`, `score` and `say`, and exported as a JSON string. A source imports the module and splices an entry in with `<%payText.confirm%>`. New text goes in the matching module, and a repeated shape gets a helper in `lib.js`.

Repeated code uses mcb's compile-time features: `REPEAT` for the per-axis and per-channel functions, `eq` for scoreboard math, and `<% %>` for values from `.js` modules. Two eq rules: an `eq` can expand to several commands, so never put one after `execute ... run`, and write subtractions with the score first, since a constant minus a score inside a product comes out with the wrong sign. The eq temporaries and constants live in `xpeco.eq.var` and `xpeco.eq.const`, set in `mcb.config.js`.

Selectors that need "not zero" or "no score yet" use predicates, since a selector score range cannot say either. `src/xpeco/predicate.js` builds the any_of predicate for a set of objectives. Pending credits, the pay list buttons, the request and reply buttons and pay each find their players with one predicate scan, and `account/named` selects players with no recorded name.

Ticking: `xpeco:tick` is the only function in `minecraft:tick`. It reads game time once, sets the throttle phases `#n2` and `#n20` in `xpeco.tmp`, then calls the function tag `#xpeco:tick`, where each module registers its own tick with `function tick xpeco:tick`. A module throttles itself with `execute if score #n20 xpeco.tmp matches 0 run ...`.
