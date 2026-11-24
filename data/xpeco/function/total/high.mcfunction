# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
scoreboard players operation @s xpeco.total = @s xpeco.lvl
scoreboard players operation @s xpeco.total *= @s xpeco.lvl
scoreboard players operation @s xpeco.total *= #9 xpeco.tmp
scoreboard players operation #a xpeco.tmp = @s xpeco.lvl
scoreboard players operation #a xpeco.tmp *= #325 xpeco.tmp
scoreboard players operation @s xpeco.total -= #a xpeco.tmp
scoreboard players operation @s xpeco.total += #4440 xpeco.tmp
scoreboard players operation @s xpeco.total /= #2 xpeco.tmp