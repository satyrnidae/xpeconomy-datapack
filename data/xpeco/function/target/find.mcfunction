# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
tag @a remove xpeco.target
tag @s add xpeco.self
scoreboard players set #steps xpeco.tmp 20
execute anchored eyes positioned ^ ^ ^ run function xpeco:target/ray
tag @s remove xpeco.self