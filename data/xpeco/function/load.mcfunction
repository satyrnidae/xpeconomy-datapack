# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
scoreboard objectives add xpeco.tmp dummy
scoreboard objectives add xpeco.cfg dummy
scoreboard players set #2 xpeco.tmp 2
scoreboard players set #5 xpeco.tmp 5
scoreboard players set #6 xpeco.tmp 6
scoreboard players set #9 xpeco.tmp 9
scoreboard players set #81 xpeco.tmp 81
scoreboard players set #100 xpeco.tmp 100
scoreboard players set #325 xpeco.tmp 325
scoreboard players set #720 xpeco.tmp 720
scoreboard players set #4440 xpeco.tmp 4440
execute unless score #mode xpeco.cfg = #mode xpeco.cfg run scoreboard players set #mode xpeco.cfg 0
execute unless score #expire xpeco.cfg = #expire xpeco.cfg run scoreboard players set #expire xpeco.cfg 600