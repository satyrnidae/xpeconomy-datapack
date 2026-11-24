# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
scoreboard players operation #amt xpeco.tmp = @s xpeco.pay
scoreboard players set @s xpeco.pay 0
function xpeco:target/find
execute unless entity @a[tag=xpeco.target] run return run tellraw @s {translate:"xpeco.pay.notarget",fallback:"Look at the player you want to pay."}
function xpeco:pay/transfer
tag @a remove xpeco.target