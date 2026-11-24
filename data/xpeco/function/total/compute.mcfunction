# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
execute store result score @s xpeco.lvl run experience query @s levels
execute store result score @s xpeco.pts run experience query @s points
execute if score @s xpeco.lvl matches ..16 run function xpeco:total/low
execute if score @s xpeco.lvl matches 17..31 run function xpeco:total/mid
execute if score @s xpeco.lvl matches 32.. run function xpeco:total/high
scoreboard players operation @s xpeco.total += @s xpeco.pts