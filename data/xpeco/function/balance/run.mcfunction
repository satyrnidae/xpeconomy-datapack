# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
scoreboard players set @s xpeco.balance 0
function xpeco:total/compute
execute if score #mode xpeco.cfg matches 0 run tellraw @s {translate:"xpeco.balance.points",fallback:"Balance: %s points",with:[{score:{name:"@s",objective:"xpeco.total"}}]}
execute if score #mode xpeco.cfg matches 1 run tellraw @s {translate:"xpeco.balance.levels",fallback:"Balance: %s levels",with:[{score:{name:"@s",objective:"xpeco.lvl"}}]}
execute if score #mode xpeco.cfg matches 2 run function xpeco:balance/hundred