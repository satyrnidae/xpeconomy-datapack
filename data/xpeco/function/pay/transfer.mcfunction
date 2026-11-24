# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
function xpeco:total/compute
execute if score @s xpeco.total < #amt xpeco.tmp run return run tellraw @s {translate:"xpeco.pay.insufficient",fallback:"Not enough experience."}
execute store result storage xpeco:tmp amount int 1 run scoreboard players get #amt xpeco.tmp
function xpeco:pay/move with storage xpeco:tmp
tellraw @s {translate:"xpeco.pay.sent",fallback:"Paid %s %s points.",with:[{selector:"@a[tag=xpeco.target,limit=1]"},{score:{name:"#amt",objective:"xpeco.tmp"}}]}
tellraw @a[tag=xpeco.target,limit=1] {translate:"xpeco.pay.received",fallback:"%s paid you %s points.",with:[{selector:"@s"},{score:{name:"#amt",objective:"xpeco.tmp"}}]}