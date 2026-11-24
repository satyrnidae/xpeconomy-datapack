# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
scoreboard players operation #age xpeco.tmp = #now xpeco.tmp
scoreboard players operation #age xpeco.tmp -= @s xpeco.req.at
execute if score #age xpeco.tmp < #expire xpeco.cfg run return 0
scoreboard players operation #from xpeco.tmp = @s xpeco.req.from
scoreboard players set @s xpeco.req.amt 0
tellraw @s {translate:"xpeco.request.expired",fallback:"The request expired."}
execute as @a if score @s xpeco.account = #from xpeco.tmp run tellraw @s {translate:"xpeco.request.expired.sender",fallback:"Your request expired."}