# xpeconomy-datapack

A native datapack port of my [xpeconomy](https://github.com/satyrnidae/xpeconomy) plugin for Spigot/PaperMC. Transactions are performed through triggers and chat selector menus. Obviously, no Vault integration here!

![Experience Economy Logo](https://camo.githubusercontent.com/5e48377c0947653cbbdbc8c51b2936ec9f5ed4042300d0fcb414ad220751d442/68747470733a2f2f696d6775722e636f6d2f7a536e7a434b582e706e67)

## AI usage disclosure

Notice: This datapack was developed with AI assistance via Anthropic's Claude Code. Co-authored commits are marked by `Co-Authored-By` tags in the commit messages, and will show Claude Code as a collaborator.  The original plugin remains AI-free. No art assets were developed with artificial intelligence.

## Commands

### Players

Player commands have been transferred to `/trigger` commands so non-operator players maintain access to them.

Some triggers are meant for internal use and will carry the `xpeco` prefix. Those will not be listed here.

|       Command      | Action |
|--------------------|--------|
| `/trigger balance` | Prints your current account balance. |
| `/trigger pay set <amt>` | Initiates a transaction with another player. If you are looking directly at a player, you will by default initiate the transaction with them. If you are not looking at a player, or you click the `[Someone else...]` confirm dialog button, you can select any player with an account from a paginated list. |
| `/trigger request set <amt>` | Initiates a payment request from another player. Similarly to the `pay` trigger, this works off of either the player you are looking at, or a selection of players from a list. Requests only work with currently-online players for now. Payment requests expire after thirty seconds with no response. |

### Operators

Plugin operator commands have also been reimplemented, some behind function commands, and some to the built-in commands.

| Command | Action |
|---------|--------|
| `/experience` | Also, `/xp`. Built-in Minecraft command which can be used to modify player XP. |
| `/function xpeco:balance/of with entity <player>` | Gets the balance of another (online-only) player. |
| `/function xpeco:uninstall` | Uninstallation function. Removes all scoreboards and disables the pack. |

### Scoreboard configuration

Some features can be altered on-the-fly via scoreboards.

Each of these can be set with a command in the form:
```
/scoreboard players set #<config entry name> xpeco.cfg <value>
```

Note that the config entry name must be prepended with a pound sign/hashtag `#`.

| Config Entry | Valid Values | Default | Details |
|-----|-----|-----|-----|
| `mode` | `0`, `1`, or `2` | `0` (points) | Display mode for account values. `0` is for points, `1` is for levels, and `2` is for hundred-points (1.00 is 100 points). Defaults to 0 when set to an invalid value. |
| `expire` | 0, or a number greater than or equal to 20 | 600 ticks (30 seconds) | The number of ticks before a payment / payment request expires. Resets to 20 when out of band. When set to 0, payments / payment requests never expire. |
| `deathdrop` | `0` or `1` | `0` (disabled) | Enables or disables the [Drop all XP on death](#drop-all-xp-on-death) mechanic. `0` to disable, `1` to enable. Defaults to `0` when set to an invalid value. |
| `bottlepoints` | Nonzero, positive whole number | 7 (the amount of XP to reach level 1) | Configures the [XP bottle filling](#xp-bottle-filling) mechanic's per-fill cost and XP returned on bottle use. Clamps to 1 when out of band. |

## Additional features

### XP bottle filling

Empty bottles can be filled at an enchantment table with experience points by holding an empty bottle and sneaking, then right-clicking the enchantment table. 7 experience points will be deducted and you'll be given a new Common rarity custom item, a "[Filled Bottle o' Enchanting](#filled-bottle-o-enchanting)".

The amount of XP can be configured by an operator to any value you like. See [Scoreboard configuration](#scoreboard-configuration) for additional details.

#### Filled Bottle o' Enchanting

Works similarly to a Bottle o' Enchanting, but with some key differences:
- It will always drop the same number of experience points used to fill it
- Can only be thrown while you are not sneaking
- Can be consumed while sneaking to fill experience points directly

If the [scoreboard configuration](#scoreboard-configuration) changes after you fill a bottle, you will regain the amount of XP as set by the current scoreboard configuration.

As an aside: if you experience issues with stacking Filled Bottles o' Enchanting, you may have one stuck in "sneak mode". In that case, just equip the item in your hand while not sneaking to reset it.

### Drop all XP on death

Disabled by default. When enabled, players drop their entire account balance on death. Works when KeepInventory is on as well. This manifests as a potentially quite huge fountain of XP which will persist for about a second after the player perishes.

The length that the XP fountain lasts can be configured at build time. See [Customizing the build](#customizing-the-build) for more details.

## Build and check

Building this datapack requires Node.js and npm to install the mc-build toolchain. Additionally, Java 25 or higher is needed for the optional pack-load sanity tests.

After cloning the source code for this project, run `npm i` to set up the toolchain.

### Building the pack from sources

`npm run build` will run mc-build once and output the transpiled mcfunction and datapack json files to the `data/` directory.

You can also run `npm run watch` to run mcb continuously in the background, regenerating the pack on changes; additionally, `npm run check` will run the static data checks.

### Testing the pack

I'd recommend creating a symbolic link in Linux/MacOS based installs, or a junction on Windows, from within your Java Minecraft testing save `datapacks` folder to the folder where you cloned this repository.

| Operating System | Directory | Command |
|-----|-----|-----|
| Windows | `%APPDATA%\.minecraft\saves\<your save>\datapacks\` | `cmd.exe /C mklink /J xpeconomy-datapack <C:\path\to\this\source\code\folder>` |
| Linux | `~/.minecraft/saves/<your save>/datapacks` | `ln -s /path/to/this/source/code/folder xpeconomy-datapack` |
| MacOS | `~/Library/Application Support/minecraft/saves/<your save>/datapacks` | `ln -s /path/to/this/source/code/folder xpeconomy-datapack` |

### Customizing the build

[mcb.config.js](./mcb.config.js) provides some global configuration values that you can alter at build time to change how the pack works.

| Option | Default | Purpose |
|--------|---------|---------|
| `bottleThrowSpeed` | 0.7 blocks/tick | Determines the throwing speed for [Filled Bottles o' Enchanting](#filled-bottle-o-enchanting) when in throw mode. |
| `deathShowerTicks` | 20 ticks | How long a player's XP fountain takes to drop all their XP after death. Extending this value could lead to a larger number of XP orbs spawning per tick. Orbs are split into random sizes under a per-tick-share which defaults to 64, and anything higher than that drops as one large orb each tick. |
| `deathLumpPoints` | 64 points | The largest per-tick share of the XP fountain that is split into random-size baubles. A bigger share drops as a single large bauble instead, so this caps how many entities a huge balance can spawn. Raise it for a more varied fountain at the cost of more entities, at most about `ln(n) + 0.6` baubles per tick for a share of `n`. |
