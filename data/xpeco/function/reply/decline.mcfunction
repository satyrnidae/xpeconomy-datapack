# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
tellraw @a[tag=xpeco.target,limit=1] {translate:"xpeco.request.declined",fallback:"%s declined your request.",with:[{selector:"@s"}]}
tellraw @s {translate:"xpeco.request.declined.self",fallback:"Request declined."}
tag @a remove xpeco.target