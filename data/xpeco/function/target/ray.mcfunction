# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
execute as @a[tag=!xpeco.self,tag=!xpeco.target,dx=0,dy=0,dz=0,limit=1,sort=nearest] run tag @s add xpeco.target
scoreboard players remove #steps xpeco.tmp 1
execute unless entity @a[tag=xpeco.target] if score #steps xpeco.tmp matches 1.. if block ~ ~ ~ #xpeco:target/ray_pass positioned ^ ^ ^0.25 run function xpeco:target/ray