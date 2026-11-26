# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Plugin-free XP currency datapack for Minecraft 26.3 (pack format 121, namespace `xpeco`), converted from the xpeconomy Paper plugin. Balance is live player XP, there is no separate ledger. README.md has the player and op command tables. Global datapack rules (mc-build only, signed commits, sentinel gate) come from `~/.claude/CLAUDE.md`.

## Commands

```
npm run build        # mcb build, writes data/ (gitignored)
npm run watch
npm run check        # build, formula, uninstall, then PackLoad / CmdCheck / Scan from the 26.3 client jar
node src/scripts/check_formula.mjs
node src/scripts/check_uninstall.mjs
```

- There is no single-test runner. The checks are the three scripts above plus `check_game.mjs`, which runs PackLoad, CmdCheck and Scan together. It needs Java 25 and the harness cache from `foxcraft-dungeon-loot-2`, see the header of `src/scripts/check_game.mjs`.
- mcb never deletes stale output and a parse error removes all output. After renaming or removing a function, `rm -rf data/xpeco` and rebuild. Run it from the project root, not from inside `data/`.
- Profiling server is `C:\Users\maskr\sandbox\xpeconomy-server`, with `world/datapacks/xpeconomy-dp` as a junction to this folder. Build here, `/reload` there, profile with `/perf start` and `/perf stop`. Never delete through the junction.

## Layout

- `src/xpeco.mcb` holds the shared load, `uninstall` and the master tick, `xpeco:tick`. The tag `#xpeco:tick` it calls is a different thing from the function. Each feature is a file under `src/xpeco/` with big ones split into `file.mcb` plus a `file/` folder, since mcb has no region folding.
- Pack settings live in the `settings` block of `mcb.config.js`. mc-build ignores that key, so `src/config.js` exposes it to sources as `config` with `import ../config.js`, along with the eq objectives this pack renamed.
- `src/text/*.js` hold every chat component as a JSON string, built from the helpers in `src/text/lib.js` (`button` wraps its label in `[ ]`). Sources splice them in with `<%payText.confirm%>`. Strings with `$(x)` are function macros. Do not write tellraw JSON inline in `.mcb`.
- `src/xpeco/predicate.js` builds the any_of predicate for "score is not zero" selectors.
- Hand-written files are limited to `pack.mcmeta`; predicates, advancements and the item modifier are declared inside the `.mcb` sources.

## Architecture

- **Ticking.** `xpeco:tick` is the only function in `minecraft:tick`. It reads game time once, sets the throttle scores `#n2` and `#n20` in `xpeco.tmp`, then calls the tag `#xpeco:tick`. Each module registers with `function tick xpeco:tick`. Throttle with `execute if score #n20 xpeco.tmp matches 0 run ...`. Triggers are enabled once a second in `trigger.mcb`, not per module.
- **Uninstall.** Each module removes its own objectives and tags in `function uninstall xpeco:uninstall`, run through the tag by `xpeco:uninstall`. A new objective or tag needs a matching remove, and `check_uninstall.mjs` fails if any is left. eq objectives are removed only if renamed in `mcb.config.js`, since the mcb defaults can be shared with other packs.
- **Input.** Players act through `/trigger` objectives (`balance`, `pay`, `request`, `xpeco.pay_*`, `xpeco.accept_charges`, `xpeco.decline_payment`) and chat click events that run them. Each trigger has a `fired` predicate so an idle tick is one scan, then a `dispatch` function.
- **Accounts.** `account.mcb` gives each player a stable number and stores `{id,name,color}` in storage `xpeco:accounts`, since scoreboards cannot be listed. The name comes from a player head item run through `fill_player_head`, which resolves `this` as the command source, so it must run as the player. The locator bar color is computed once from the UUID, see `account/color`.
- **Money flow.** `pay` and `request` set a pending amount on the player, `target` finds the player in the crosshair with a 0.25 block ray, otherwise `paylist` offers a paged list, then a confirm step. Offline accounts are paid through the `xpeco.pending` ledger keyed by player name and applied on their next tick online.
- **XP math.** Never use `experience query ... points` for a balance. It floors a float and loses a point per pickup cycle. `xpeco:total/compute` rounds from `XpP` and is the one place that turns level and progress into `xpeco.total`. A dead player stays selectable and keeps their XP until respawn.
- **Bottles and orbs.** Sneaking with a glass bottle at an enchanting table puts an interaction entity over it, and its click fills the bottle. A thrown filled bottle is tracked with a marker, and on landing `orbs.mcb` splits exactly `bottlePoints` into random orbs. `death.mcb` reuses `xpeco:orbs/split` for the optional drop-all-XP-on-death shower, run from a marker so a quick respawn does not cut it short.

## mcb pitfalls

Full notes in `~/.claude/mc-build-compile-time.md`. The ones that bite here:

- An `eq` can expand to several commands. Never put one after `execute ... run`, and use a small function instead.
- Write subtractions score-first. A constant minus a score inside a product comes out with the wrong sign.
- `return` inside a block `run { ... }` only leaves the generated function. Use `return run function` when a failure must propagate.
- Consecutive `execute` lines on one condition are combined into a block. Do not combine lines where an earlier one changes the condition.
- Macro substitution of NBT is text, so `Value:$(v)` works and `Motion:[$(x),...]` needs doubles written with a decimal point.
- 26.3 predicate and registry keys differ from older versions. `Scan` fails on a key the game drops silently, so run `npm run check` after touching any JSON.

## Commits

Gitmoji prefix, subject 50 characters or fewer, and a body. The commit-message hook rejects a subject-only message. Origin is `https://github.com/satyrnidae/xpeconomy-datapack`, license CC0 1.0. README keeps an AI use disclosure as its first section.
