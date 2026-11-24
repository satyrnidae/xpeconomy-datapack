# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
$scoreboard players set #amt xpeco.tmp $(amount)
function xpeco:total/compute
execute if score #amt xpeco.tmp matches ..0 run return run tellraw @s {text:"Amount must be positive."}
execute if score @s xpeco.total < #amt xpeco.tmp run return run tellraw @s {text:"Not enough experience."}
$experience add @s -$(amount) points
$scoreboard players add $(to) xpeco.pending $(amount)
$tellraw @s {text:"Paid $(to) $(amount) points."}