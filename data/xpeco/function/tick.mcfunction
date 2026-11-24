# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
execute as @a[scores={xpeco.pending=1..}] run function xpeco:pending/apply
execute as @a[scores={xpeco.pending=..-1}] run function xpeco:pending/apply
scoreboard players enable @a xpeco.balance
execute as @a[scores={xpeco.balance=1..}] run function xpeco:balance/run
scoreboard players enable @a xpeco.pay
scoreboard players set @a[scores={xpeco.pay=..-1}] xpeco.pay 0
execute as @a[scores={xpeco.pay=1..}] at @s run function xpeco:pay/run
execute as @a unless score @s xpeco.account = @s xpeco.account run function xpeco:account/assign
scoreboard players enable @a xpeco.request
scoreboard players enable @a xpeco.reply
scoreboard players set @a[scores={xpeco.request=..-1}] xpeco.request 0
execute as @a[scores={xpeco.request=1..}] at @s run function xpeco:request/run
execute store result score #now xpeco.tmp run time query gametime
execute as @a[scores={xpeco.req.amt=1..}] run function xpeco:request/check_expiry
execute as @a[scores={xpeco.reply=1..}] run function xpeco:reply/run
scoreboard players set @a[scores={xpeco.reply=..0}] xpeco.reply 0