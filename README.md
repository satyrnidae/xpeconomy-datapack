# xpeconomy-dp

Plugin-free XP currency for Minecraft 26.3, built with mc-build. Balance is live XP, so there is no separate ledger.
Design notes and feasibility are in [datapack-feasibility.md](datapack-feasibility.md).

## Commands

Players use `/trigger`, since datapack functions need permission level 2. The two chat button triggers carry the xpeco.
prefix so they stay out of the way of players typing commands, they are meant to be clicked from a request.

| Command | Does |
|---|---|
| `/trigger balance` | Prints your balance in the configured mode |
| `/trigger pay set <amount>` | Pays the player you are looking at |
| `/trigger request set <amount>` | Asks the player you are looking at, with chat buttons, expires after 30 seconds |
| `/trigger xpeco.accept_charges` | Pays a pending request, run by the chat button |
| `/trigger xpeco.decline_payment` | Declines a pending request, run by the chat button |

Bottles: sneak with a glass bottle in the main hand and right-click an enchanting table within 3 blocks. Costs
`bottlePoints` XP and a glass bottle, creative is free. A thrown filled bottle returns exactly `bottlePoints`.

## Ops

- Permissions: none. Every player can use every trigger. There are no exempt players and no op-only defaults.
- Admin add, deduct, set: use the builtin `/experience`.
- Config reload: `/reload`, settings come from `config.json` at build time.
- Display mode: `/scoreboard players set #mode xpeco.cfg <0|1|2>`, points, levels, per hundred.
- Balance of another player: `/function xpeco:balance/of {target:"@a[name=Steve]"}`, any selector, online players only.
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
