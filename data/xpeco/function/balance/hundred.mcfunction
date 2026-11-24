# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
scoreboard players operation #w xpeco.tmp = @s xpeco.total
scoreboard players operation #w xpeco.tmp /= #100 xpeco.tmp
scoreboard players operation #f xpeco.tmp = @s xpeco.total
scoreboard players operation #f xpeco.tmp %= #100 xpeco.tmp
execute if score #f xpeco.tmp matches ..9 run tellraw @s {translate:"xpeco.balance.hundred",fallback:"Balance: %s.0%s hundreds",with:[{score:{name:"#w",objective:"xpeco.tmp"}},{score:{name:"#f",objective:"xpeco.tmp"}}]}
execute if score #f xpeco.tmp matches 10.. run tellraw @s {translate:"xpeco.balance.hundred",fallback:"Balance: %s.%s hundreds",with:[{score:{name:"#w",objective:"xpeco.tmp"}},{score:{name:"#f",objective:"xpeco.tmp"}}]}