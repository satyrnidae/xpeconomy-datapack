# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
tellraw @s {text:"Uninstalling Experience Economy v0.1.0-prototype..."}
function #xpeco:on_uninstall
data remove storage xpeco:tmp amount
execute store success score #uninstall xpeco.cfg run datapack disable "file/xpeconomy-dp"
execute unless score #uninstall xpeco.cfg matches 1 run tellraw @s [{text:"Pack folder name has changed. ",color:"red"},{text:"Finish with /datapack disable \"file/<pack folder>\"",color:"aqua"}]
execute if score #uninstall xpeco.cfg matches 1 run tellraw @s {text:"Experience Economy uninstalled.",color:"green"}
scoreboard objectives remove xpeco.tmp
scoreboard objectives remove xpeco.cfg