# Datapack conversion feasibility: Experience Economy -> Minecraft 26.3

Scope: could the Paper plugin (xpeconomy, Vault provider, XP-backed currency) be rebuilt as a vanilla datapack for Minecraft 26.3?

Basis: plugin source on `master` plus README. Datapack capabilities below come from knowledge of the 1.21.x data-driven feature set. Nothing here was checked against 26.3 decompiled sources, so every item marked VERIFY needs a prototype or a source check before commitment.

## Decision

Goal confirmed: plugin-free XP currency. Vault interop is dropped from scope, so the Vault row below is an accepted loss, not a blocker. Work for this conversion lives in `sandbox/xpeconomy-dp`.

## Verdict

Partially feasible. A datapack can reproduce the player-facing core: check balance, pay an online or recently seen player, bottle XP, display modes. It cannot reproduce the integration surface that makes this an economy plugin: Vault, per-node permissions, MySQL, command aliases and arbitrary-argument commands for non-ops.

Recommendation: build it only if the goal is "XP as currency with no server plugins". If other plugins consume the economy through Vault, a datapack is a dead end and the Java plugin should stay.

Rough split by feature: about 55% reproducible, 25% reproducible with workarounds, 20% not reproducible.

## What the plugin actually does

- Implements the Vault `Economy` interface, so shops, jobs, and claims plugins can read and charge XP.
- Keeps a ledger per UUID, separate from live XP. Ledger is synced to XP on join, on `PlayerExpChangeEvent`, after enchanting, and after anvil use.
- Three display modes over one raw point total: POINTS, LEVELS, PER_HUNDRED. Raw total is always points; the mode only changes conversion and rounding.
- Offline accounts. Admin commands can credit or debit a player who is not online; the change applies on next join.
- Storage: YAML or MySQL, batched saves.
- Commands: add, deduct, set, balance, experience, pay, sync, transfer, reload, about, help. Aliases, tab completion, and a permission tree with `exempt` and `exempt.bypass` nodes per command.
- XP bottles: fill by right-clicking an enchanting table with a glass bottle, fixed points per bottle, optional no-throw, optional glass bottle refund on throw.
- Localization via `.lang` files, bStats metrics.

Side note: the working tree is mid-refactor and does not compile. `PlayerAccount.of` has no body and `PayCommandHandler` references an undefined `player`. `config.yml` and the README config block also disagree on storage keys. Worth settling before using this as a spec.

## Feature matrix

| Feature | Datapack? | How / blocker |
|---|---|---|
| Vault provider | No | Datapacks run no Java and register no services. Hard blocker for any consumer plugin. |
| Balance = live XP | Yes | Drop the separate ledger. Read with `experience query`, write with `experience add`/`set`. |
| Sync tasks, enchant/anvil listeners | Not needed | If balance is live XP, vanilla already deducts it. The whole sync layer disappears. |
| POINTS / LEVELS / PER_HUNDRED | Yes | Pure display math on scoreboard ints. LEVELS needs the piecewise level-to-total formulas, which are integer-safe. Writes use `experience add`, so no inverse sqrt needed. |
| Balance query, own | Yes | `/trigger` objective, function prints via `tellraw`. |
| Balance query, other player | Workaround | `/trigger` carries one integer, no player argument. Needs a dialog or a clickable list of online players. |
| Pay online player | Workaround | See Commands below. |
| Pay offline player | Workaround | Pending-delta scoreboard keyed by name, applied on join. |
| Admin add/deduct/set/transfer | Redundant | Ops already have `/experience`. Only the offline-target case adds anything. |
| Exempt / bypass permissions | No | No permission nodes. Approximate with tags and scoreboard flags, which ops grant by hand. |
| Op-level defaults | Partial | Gate on command permission level or tags. VERIFY how 26.x permission sets interact with `/function` and `/trigger`. |
| MySQL / multi-server | No | Only world storage: `/data` command storage and scoreboards. No shared DB across servers. |
| Config file, `reload` | Workaround | Constants in command storage or a scoreboard, edited by function. `/reload` replaces the reload command. |
| Aliases, usage text | No | Functions are namespaced; no alias registration. `/trigger` names are the only short commands. |
| Tab completion | No | Nothing for arbitrary function arguments. Dialogs and clickable chat are the substitute. |
| i18n | Workaround | `translate` components with a `fallback` string work without a resource pack. Real localization needs a paired resource pack. |
| bStats | No | Not applicable, and arguably a feature. |
| Per-bottle point value | Needs prototype | See Bottles. |
| Fill bottle at enchanting table | Workaround | See Bottles. |
| No-throw bottles, bottle refund | Needs prototype | See Bottles. |

## Design sketch

Namespace `xpeco`. No separate account store for online players.

- Online balance: live player XP. Raw total computed from level plus points by function, never cached, so it cannot desync.
- Offline ledger: objective `xpeco.pending`, holder is the player name string. `scoreboard players add <name>` works for names that are not online. On join, a tick-driven detector function applies the pending delta with `experience add` and zeroes it.
- Rename risk: name keys break when a player renames. UUID keys avoid that but need the int-array UUID stringified through macros. Name keys for v1, UUID as a later hardening step. VERIFY macro handling of UUID arrays.
- Config: `xpeco:config` command storage, read by macro functions. Mode switch, points per bottle, starting balance.
- Constants: level formulas as scoreboard arithmetic.
  - L <= 16: `L^2 + 6L`
  - 17 <= L <= 31: `(5L^2 - 81L + 720) / 2`
  - L >= 32: `(9L^2 - 325L + 4440) / 2`
  - All divisions are exact on integers.
- Limit: scoreboards are int32. Plugin uses BigInteger. Irrelevant in practice since vanilla XP also caps at int32.

## Commands

Core problem: `/function` needs permission level 2, so ordinary players cannot call datapack functions directly. The only commands every player can run are vanilla ones plus `/trigger`, which sets or adds one integer to an enabled objective.

Workable patterns, in order of preference:

0. Look-at pay. `/trigger pay set <amount>` while looking at the target. A function raycasts from the payer's eyes in 0.25 block steps up to 5 blocks, stops at the first block not in `#xpeco:target/ray_pass`, and tags the first other player whose hitbox it enters. No target argument, no dialog. Online targets only; offline pay stays an op tool via `pay/to_name`. Same idea can serve `balance` for another player. Prototyped in `pay/run`, static checks only.
1. Dialogs. A tick function sees a trigger score, then runs `dialog show` for that player with a macro-built dialog. Number input for amount, single-option list of online players for target. The dialog's run-command action can then call `trigger` with integers. Not a full replacement for typed arguments and only lists online players. VERIFY dialog action semantics and what permission the dialog's command runs under in 26.3.
2. Clickable `tellraw` menus. Same flow without dialogs; clunkier.
3. Fixed-step triggers. `/trigger xpe_pay set <amount>` then `/trigger xpe_pay_to set <n>` where `n` indexes a printed online-player list. Works, ugly.

`pay` to an offline player is the awkward one. Dialog lists cannot enumerate offline names, so offline pay needs either an op-run function with a macro name or a stored recent-players list built on join.

## Bottles

Plugin cancels interact events, overrides `ExpBottleEvent.setExperience`, and denies block use. Datapacks cannot cancel or rewrite events.

- Fill at table: the `any_block_use` / `item_used_on_block` advancement triggers can detect "glass bottle in hand, enchanting table clicked". They cannot suppress the table GUI. Workaround is to require sneak, since sneaking with an item in hand normally skips block interaction. That inverts the plugin's behavior, where sneaking aborts the fill. VERIFY trigger names and sneak behavior in 26.3.
- Drink without throwing: item components such as `consumable` on a custom item make this simple. Whether adding it to the vanilla `experience_bottle` overrides its throw behavior is unknown. VERIFY. Fallback is a custom bottle item built on another base.
- Fixed points per bottle: vanilla orb value is random 3 to 11 and is not exposed. Fallback is to detect the thrown entity each tick, then handle landing in a function. This is fragile and tick-heavy. Likely cut `pointsPerBottle` for thrown bottles and keep it only for the drink path.
- Refund on throw: same entity-tracking problem. Probably cut.

## Risks

- Scope creep into UI. Most of the work is not economy logic, it is replacing typed commands. Budget for it.
- 26.x churn. Pack format fields, permission handling, dialog and component schemas have all moved recently. Pin to one 26.3 snapshot of the format and expect to revisit on 26.4.
- Tick cost. Join detection, bottle tracking, and trigger polling all run every tick. Gate each behind `execute if entity @a[...]` selectors and keep them tiny.
- Silent loss of Vault consumers. Anything that calls `Economy#withdrawPlayer` simply stops working. Document loudly.
- Existing data. YAML and MySQL accounts have no import path. One-off migration would be a generated `.mcfunction` that seeds `xpeco.pending` per name.

## Suggested path

1. Prototype in a throwaway pack against 26.3: trigger -> function -> `tellraw` balance, and the pending-delta join apply. Half a day. Settles the permission question.
2. Prototype dialog-based pay. Settles whether commands are tolerable.
3. Prototype bottle drink via `consumable` and bottle fill via sneak-click. Settles which bottle features survive.
4. Decide go or no-go on those three results. If dialog pay or bottles fail, the datapack is a thin balance viewer and not worth shipping.
5. Full build: modes, config storage, fallback-translate messages, migration function.

## Open questions

- Resolved: plugin-free XP currency is the goal, Vault interop not required.
- Do players need to pay offline players?
- Is a paired resource pack acceptable for localization, or fallback strings only?
- Single server, or shared storage across several?

## Prototype 1 results

Pack: project root, format 121, namespace `xpeco`. Sources are mc-build `.mcb` under `src/`, built with `npm run build` into `data/`. `data/` is gitignored and holds only mc-build output, functions, tags, the advancement and the predicate included; a clean delete and rebuild reproduces it byte for byte. `config.json` feeds `expireTicks` and `rayStepCount` into the sources. Build output was diffed against the original hand-written functions, ignoring comments, and matched for all 21 functions. Static checks, formula check:  `node src/scripts/check_formula.mjs`.

Contents:
- `trigger balance` -> `balance/run`, prints total in the configured mode with `translate` plus `fallback`, so no resource pack.
- `total/compute`: level and progress points -> raw total, three integer branches matching the plugin formulas.
- Offline ledger: `xpeco.pending`, holder is the player name. An online player's own score is the same entry, so `scoreboard players add <name>` works for offline and online targets alike, and `tick` applies it with a macro `experience add`. No join detection needed.
- `pay/to_name {to,amount}`: balance check, withdraw, credit through the ledger. Op only.
- `trigger pay`: look-at pay for everyone, see Commands.

Checked, statically:
- All 65 plain commands parse with the 26.3 command dispatcher. Macro lines were parsed with sample values substituted.
- `PackLoad` loads the pack against vanilla data with no errors.
- Level formulas match `PlayerXPUtils.getXPForLevel` for levels 0 to 14,999. Spot values: L16 = 352, L30 = 1395, L32 = 1628.
- Int32 limit: `9 * L^2` overflows at level 15,447. Not a practical concern.

Not checked, needs a running 26.3 world:
- Resolved: `experience query points` returns points within the current level, not the total, so `total/compute` and the level formulas stay. Writes use `experience add` and `set`, which is why no inverse formula is needed, unlike the plugin.
- Resolved: negative `experience add` clamps at zero total. Pay checks the sender's balance first, so overpaying is blocked before any withdrawal.
- Resolved: `/function` needs permission level 2 on Java Edition per the wiki, so non-ops cannot call `xpeco:pay/to_name`. Player-facing commands must go through `/trigger`, dialogs or clickable chat. Wiki figure, not checked against 26.3 code.
- Trigger flow in a live world.
- Tick cost with many players.

Findings that change the design:
- The pending ledger removes the need for join detection and a UUID store. Name keys remain the rename risk.
- Ledger debits on an offline player clamp at zero on apply, so a debit larger than their balance silently under-charges. Only matters for admin deducts; pay only ever credits the target.

Next: dialog-based pay (step 2), then bottle drink and fill (step 3), both still unprototyped.

## Prototype 1b: look-at pay

Added `pay/run`, `target/ray`, `pay/move`. Parses and loads under 26.3, same static checks as above. Untested in a world:
- `dx=0,dy=0,dz=0` hit test against player hitboxes at the ray point.
- `#xpeco:target/ray_pass` as the pass-through test: replaceable plants, fluids and fire, flowers, crops, saplings, signs, rails, buttons, plates, levers, torches, cobweb, tripwire and the vine family. Everything else stops the ray, including glass. The tag is defined in `target.mcb` with an mcb `tag blocks` block. Add entries there if a block is missing.
- `@s` in a `tellraw` selector resolving to the payer when the message goes to the target.

## Prototype 1c: payment requests

`/trigger request set <amount>` while looking at a player. The target gets a chat line with [Pay] and [Decline]; the buttons run `/trigger xpeco.accept_charges` and `/trigger xpeco.decline_payment`, which any player may use, so no op level is involved. Pay sends points to the requester from the clicker through the same `pay/transfer` as look-at pay, so the overpay check is shared.

Pieces: `request/run`, `reply/run`, `reply/decline`, `target/find`, `pay/transfer`, `account/assign`.

Design notes:
- The request lives on the target as two scores, `xpeco.req.amt` and `xpeco.req.from`. The sender is a per-name integer account number from `xpeco.account`, so the click carries no name and nothing needs macros.
- One pending request per target; a new one replaces it. Requests expire after 600 ticks, 30 seconds, set by `#expire` in `xpeco.cfg`. The request stores `time query gametime` in `xpeco.req.at`, and `tick` runs `request/check_expiry` for every player with a pending request; it clears the request and tells both sides if online. Cost is one score compare per pending request per tick.
- Pay needs the requester online. If they left, the target is told and the request is cleared.
- The xpeco.accept_charges and xpeco.decline_payment triggers are always enabled, so a stray use with nothing pending prints "No pending request."

Same static checks as above, 127 commands parsed, pack loads. Untested in a world:
- Whether 26.3 shows a confirmation before a chat `run_command` click runs. VERIFY. If it does, the flow still works with one extra click.
- SNBT `click_event` and `hover_event` shape was only parsed, not rendered.

## Prototype 1d: layout and uninstall

Objective definitions now live beside the functions that use them. Each `.mcb` file under `src/xpeco/` has its own `minecraft:load` function, and every trigger is defined directly above its command in `cmd.mcb`. `src/xpeco.mcb` keeps only what is shared: `xpeco.tmp`, `xpeco.cfg`, the math constants and config defaults. mc-build merges the per-file load functions into one `minecraft:load` tag.

`/function xpeco:uninstall`, op only, runs `#xpeco:on_uninstall`. Each feature file adds its own removals to that tag, so a new objective and its cleanup sit in the same file. Uninstall then clears `xpeco:tmp` storage, runs `datapack disable` for `file/<packName>`, and removes the shared objectives last. Pending offline credits go with `xpeco.pending`.

`node src/scripts/check_uninstall.mjs` verifies the built output: every objective and tag added anywhere is removed by the uninstall path. Currently 14 of 14 objectives and 2 of 2 tags.

Known gap: tags on offline players survive an uninstall. `xpeco.self` and `xpeco.target` are removed within the same function that sets them, so this should not arise in practice.

Layout after the split: one `.mcb` per feature under `src/xpeco/`: `balance`, `pay`, `request`, `reply`, `target` for the raycast, `account`, `pending` and `total`. `src/xpeco.mcb` keeps only the shared `load` and `uninstall`. Each feature file defines its own `tick` and registers it in `minecraft:tick`, so the tick body is split by domain; the tag runs them in alphabetical order, which nothing depends on. The op-only offline pay is `pay/to_name`, in `pay.mcb` with the other pay functions.

## Prototype 2: XP bottle fill

`bottle.mcb`, config in `config.json`: `bottlePoints` 7, `bottleReachSteps` 13.

Checked against the 26.3 bytecode, not just the wiki:
- A plain click on a table fires `default_block_use` after the menu opens, so the menu cannot be cancelled from a block trigger.
- Sneaking with an item in hand skips block interaction in `ServerPlayerGameMode.useItemOn`, so no block trigger fires on a sneak-click either.

Implementation: interaction entity over the table. Each tick, a player who is sneaking with a glass bottle in the main hand ray-casts along the eye line. On reaching an enchanting table within reach, an `interaction` entity tagged `xpeco.bottle.table` is summoned over the table, 1.1 wide and 0.85 tall so it wins the pick over the block. Right-clicking it fires `player_interacted_with_entity`, whose advancement `bottle/table/on_interact` rewards `bottle/fill`. The table menu never opens because the click goes to the entity. When no qualifying player is within 6 blocks, the entity is killed.

Reach is the entity interaction range, 3 blocks, so `bottleReachSteps` of 13 at 0.25 per step covers it. Side effects while the entity exists: the table cannot be broken, and other players near it get the entity click instead of the menu.

`fill` checks the balance, takes `bottlePoints`, consumes one glass bottle and gives an experience bottle. A full inventory drops it. Creative players skip the balance check, the deduction and the bottle use. Uninstall kills the entities and revokes the advancement.

Fixed return on throw: `fill` hands out the bottle with `loot give`. Loot table `bottle/item/filled` is one `experience_bottle` plus a root `"modifier": "xpeco:bottle/filled"`, the item modifier that sets `item_name` "Filled Bottle o' Enchanting", rarity common and custom_data `"xpeco:player_filled":1b`, the last through `set_custom_data` so the flag stays a byte. A loot table applies an item modifier through that root `modifier` key, or an entry-level one; 26.3 has no `reference` loot function, and a bare id in `functions` did nothing, which is why two earlier attempts handed out plain bottles. In 26.3 loot functions are keyed `type`, not `function`. Throwing gives no advancement trigger, only the `used` stat, so tick finds thrown `experience_bottle` entities carrying that data in their `Item` stack and tags them `xpeco.tracked_bottle`. A `marker` tagged `xpeco.bottle_tracker` rides each one. A tracker with no vehicle means the bottle landed: orbs within 3 blocks are killed and exactly `bottlePoints` of orbs are spawned, split at random. A direct hit on a player is the exception: the player collects the vanilla orbs in the same tick, before tick can kill them. While a bottle is in flight, players within 3 blocks of it get a per-tick total snapshot in `xpeco.bottle_prev`; on landing, what they gained since the snapshot, up to 11, is taken back before the 7 points spawn. Caveats: unrelated orbs near the impact die too, and the marker position lags the impact by up to a tick of travel.

Orbs spawned by the replacement carry `xpeco.filled_bauble`, and the landing kill skips them, so bottles that land together do not remove each other's orbs.

Wall-aware orb motion: vanilla flips the random orb vector when it points into the surface hit, using the face normal for blocks and the reverse of the bottle motion for entities. The marker keeps its position and last-step speed in its `data` tag, in thousandths of a block, updated every tick in flight. On landing, `bottle/normal/normal` probes 1.1 steps ahead along each axis the bottle was moving on; a block outside `#xpeco:target/ray_pass` there gives a normal of the opposite of the travel direction on that axis. With nothing solid found, as for an entity hit, the normal is the reverse of the motion, and with no motion, up. `bottle/orbs/orient` takes the dot product of the normal with the three scaled motion rolls and negates all three when it is negative. Limits: the marker lags the impact by up to a tick of travel, about 0.7 blocks, so a bottle clipping a corner can pick the wrong face, and speeds under 0.02 per tick are ignored.

Static checks pass: PackLoad, CmdCheck and the uninstall coverage script. Not tested in game.

Dropped by decision: drinking a bottle without throwing it.

Layout of the bottle code: `bottle.mcb` keeps `fill` and `give`, and `bottle/` holds `table` for the interaction entity, `item` for the loot table, modifier and predicate of a filled bottle, `thrown` for tracking a thrown bottle, `normal` for the surface normal and `orbs` for the replacement orbs. mcb has no region folding, so a large file is split into `file.mcb` plus a `file/` folder of subfiles, and a subfile's functions get its name in the id.

## Prototype 3: pay list and confirm

`/trigger pay set <amount>` stores the amount and a timestamp. A player in the crosshair goes straight to a confirm prompt; otherwise a list of every account is shown, 15 a page in three columns of five, in the order the accounts were first seen. Names are clickable and run `/trigger xpeco.pay_to set <id>`. Confirm and deny are `xpeco.pay_confirm` and `xpeco.pay_deny`, and a pending payment expires after `#expire` ticks like a request. Offline accounts are paid through the pending ledger by name.

Names for offline accounts: scoreboards cannot be listed, so `xpeco:accounts` stores a list of `{id,name}`. The name is read from a player head, since `fill_player_head` resolves the profile of the player running the modifier, and `profile.name` is stored once per player. A rename is picked up on the next rejoin: the objective `xpeco.left` counts `leave_game`, so it is nonzero on the first tick back, and the name is read again. When it changed, credits waiting in the pending ledger under the old name move to the new one, since that ledger is keyed by name. Limits: a rename shows only after that player has left and rejoined, and accounts that existed before names were stored appear only after that player next joins. Not tested in game.
