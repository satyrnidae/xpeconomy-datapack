# Experience Economy datapack prototype
# Built using mc-build (https://github.com/mc-build/mc-build)
scoreboard players operation #amt xpeco.tmp = @s xpeco.request
scoreboard players set @s xpeco.request 0
function xpeco:target/find
execute unless entity @a[tag=xpeco.target] run return run tellraw @s {translate:"xpeco.request.notarget",fallback:"Look at the player you want to ask."}
scoreboard players operation @a[tag=xpeco.target,limit=1] xpeco.req.from = @s xpeco.account
scoreboard players operation @a[tag=xpeco.target,limit=1] xpeco.req.amt = #amt xpeco.tmp
execute store result score @a[tag=xpeco.target,limit=1] xpeco.req.at run time query gametime
tellraw @a[tag=xpeco.target,limit=1] [{translate:"xpeco.request.received",fallback:"%s requests %s points. ",with:[{selector:"@s"},{score:{name:"#amt",objective:"xpeco.tmp"}}]},{text:"[Pay]",color:"green",click_event:{action:"run_command",command:"/trigger xpeco.reply set 1"},hover_event:{action:"show_text",value:{text:"Pay the requested amount"}}},{text:" "},{text:"[Decline]",color:"red",click_event:{action:"run_command",command:"/trigger xpeco.reply set 2"},hover_event:{action:"show_text",value:{text:"Refuse the request"}}}]
tellraw @s {translate:"xpeco.request.sent",fallback:"Requested %s points from %s.",with:[{score:{name:"#amt",objective:"xpeco.tmp"}},{selector:"@a[tag=xpeco.target,limit=1]"}]}
tag @a remove xpeco.target