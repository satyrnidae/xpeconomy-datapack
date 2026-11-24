# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
execute store result storage xpeco:tmp amount int 1 run scoreboard players get @s xpeco.pending
function xpeco:pending/apply_macro with storage xpeco:tmp
scoreboard players set @s xpeco.pending 0