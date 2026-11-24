# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
scoreboard players operation #r xpeco.tmp = @s xpeco.reply
scoreboard players set @s xpeco.reply 0
execute if score @s xpeco.req.amt matches ..0 run return run tellraw @s {translate:"xpeco.request.none",fallback:"No pending request."}
scoreboard players operation #amt xpeco.tmp = @s xpeco.req.amt
scoreboard players operation #from xpeco.tmp = @s xpeco.req.from
scoreboard players set @s xpeco.req.amt 0
tag @a remove xpeco.target
execute as @a if score @s xpeco.account = #from xpeco.tmp run tag @s add xpeco.target
execute unless entity @a[tag=xpeco.target] run return run tellraw @s {translate:"xpeco.request.gone",fallback:"The requester is not online."}
execute if score #r xpeco.tmp matches 2 run return run function xpeco:reply/decline
execute if score #r xpeco.tmp matches 1 run function xpeco:pay/transfer
tag @a remove xpeco.target