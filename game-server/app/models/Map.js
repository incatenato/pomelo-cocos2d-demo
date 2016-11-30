var EventEmitter = require('events').EventEmitter;
var dataApi = require('../util/dataApi');
var pomelo = require('pomelo');
var ActionManager = require('./action/actionManager');
var timer = require('./timer');
var EntityType = require('../consts/consts').EntityType;
var logger = require('pomelo-logger').getLogger(__filename);
var fs = require('fs');
var BGold = require('./BGold');
var CMGold = require('./CMGold');
var HashMap = require('HashMap');
var HashSet = require('HashSet');
var CMPlayer = require('./CMPlayer');
var CMTeam = require('./CMTeam');

var exp = module.exports;
var id = 0;
var width = 0;
var height = 0;
var actionManager = null;
var players = {};
var entities = {};
var channel = null;
var treasureCount = 0;
var goldCount = 0;


var maxGoldCount = 0;
var initGoldPeriod = 0;
var goldSeed = 0;
var teamIndex = 0;
var maxTeamCount = 0;
var playerMap = null;
var goldMap = null;
var teamMap = null;
var teamInfo = null;
var mapValidPosArray = new HashMap();
var eatedPosArray = [];



/**
 * 获取频道 用于发送信息
 * @type {exports.getChannel}
 */
var getChannel = exp.getChannel = function () {
    if (channel) {
        return channel;
    }
    channel = pomelo.app.get('channelService').getChannel('map_' + id, true);
    return channel;
};

/**
 * 地图初始化
 */
exp.init = function(){
    //mapValidPosArray = new HashMap();
    maxGoldCount = 1500;
    initGoldPeriod = 12000;
    maxTeamCount = 20;

    playerMap = new HashMap();
    goldMap = new HashMap();
    teamMap = new HashMap();
    teamInfo = new HashMap();

    teamInfo.set(1, "美洲豹");
    teamInfo.set(2, "东北虎");
    teamInfo.set(3, "蝎子");
    teamInfo.set(4, "鳄鱼");
    teamInfo.set(5, "北极狐");
    teamInfo.set(6, "长颈鹿");
    teamInfo.set(7, "狮子");
    teamInfo.set(8, "猩猩");
    teamInfo.set(9, "小熊猫");
    teamInfo.set(10, "海豹");
    teamInfo.set(11, "天鹅");
    teamInfo.set(12, "海鸥");
    teamInfo.set(13, "蝗虫");
    teamInfo.set(14, "恐龙");
    teamInfo.set(15, "啄木鸟");
    teamInfo.set(16, "犀牛");
    teamInfo.set(17, "考拉");
    teamInfo.set(18, "森林狼");
    teamInfo.set(19, "阿拉斯加");
    teamInfo.set(20, "北极熊");


    for(var i = 0;i< 101;i++){
        for(var j = 0;j< 101;j++){
            if(i%2 != 0 || j%2 != 0){
                var pos = this.getPosByXAndY(i, j);
                mapValidPosArray.set(pos);
            }
        }
    }

    var lines = fs.readFileSync("./config/map_1.tmx", "utf-8"); //Maybe have problem.
    console.log(lines);
    this.initMapValidPos(lines.split("\n"));
    this.initGolds();
};

/**
 * 转换坐标为position
 * @param x
 * @param y
 * @returns {*}
 */
exp.getPosByXAndY = function(x, y){
    return x + y * 101;
};

/**
 * 同步读取文件
 * @param file_name
 * @returns {*}
 */
exp.syncReadFile = function(file_name){
    return fs.readFile(file_name);
};

/**
 * 生成玩家
 * @returns {CMPlayer|*}
 */
exp.createPlayer = function(){
    var cmPlayer = new CMPlayer(userId,pyUserId);
    var pyPlayer = this.getPlayerInfo(pyUserId);
    if(pyPlayer != null){
        var oldTeamId = pyPlayer.teamId;
        var oldTeamName = pyPlayer.teamName;
        if(teamMap.has(oldTeamId)){
            var oldTeam = teamMap.get(oldTeamId);
            var curPlayerCount = oldTeam.playerMap.count();
            if(curPlayerCount == oldTeam.maxPlayerCount){
                cmPlayer.enterState = (EntityType.ENTER_STATE.TEAM_LIMIT);
            }else{
                oldTeam.playerMap.set(userId, cmPlayer);
                cmPlayer.teamId = oldTeamId;
                this.playerMap.set(userId, cmPlayer);
                cmPlayer.teamId = oldTeamId;
                cmPlayer.teamName = oldTeamName;
            }
        }
    }else{
        var curTeamCount = teamMap.count();
        if(curTeamCount == maxTeamCount){
            cmPlayer.enterState = EntityType.ENTER_STATE.ROOM_LIMIT;
        }else{
            var newTeamId = teamIndex;
            var newTeamName = teamInfo.get(newTeamId);
            var newTeam = new CMTeam(newTeamId);
            newTeam.playerMap.set(userId, cmPlayer);
            newTeam.teamName = newTeamName;
            teamMap.set(newTeamId,newTeam);
            playerMap.set(userId, cmPlayer);
            cmPlayer.teamId = newTeamId;
            cmPlayer.teamName = newTeamName;
        }
    }
    return cmPlayer;
};

/**
 * 删除玩家
 * @param userId
 * @returns {boolean}
 */
exp.removePlayer = function(userId){
    if(userId == null) return false;
    playerMap.remove(userId);
    return true;
};

/**
 * 从玩家列表中获取玩家信息
 * @param userId
 * @returns {*}
 */
exp.getPlayerInfo = function(userId){
    if(userId == null) return null;
    if(playerMap.has(userId)) return playerMap.get(userId);
    return null;
};

/**
 * 吃宝石
 * @param key
 * @returns {*}
 */
exp.getGold = function(key){
    var gold = goldMap.get(key);
    goldMap.remove(key);
    return gold;
};

/**
 * 判断是否吃到金币
 * @param pos
 * @returns {boolean}
 */
exp.judgeEatGold = function(pos){
    if(goldMap.has(pos)) return true;
    return false;
};

/**
 * 死亡后爆炸处理
 */
exp.bombGold = function(cmPlayer){
    goldSeed = new Date().getTime;
    var curCount = 0;
    var bombCount = Math.ceil(cmPlayer.score * 2/10);
    var offset = 1;
    var cmPos = cmPlayer.getPos();
    var cmX = this.getPosXByPos(cmPos);
    var cmY = this.getPosYByPos(cmPos);
    var golds = [];
    //TODO: 重构吧。。
    while(curCount < bombCount){
        for(var x = 0;x <= offset;x++){
            for(var y = 0;y <= offset;y++){
                var targetPos1 = this.getPosByXAndY(cmX + x, cmY + y);
                if(mapValidPosArray.has(targetPos1)){
                    var id = randomSeedIntByRange(4, 6);
                    var cmGold = new CMGold(id,targetPos1);
                    goldMap.set(targetPos1,cmGold);
                    var bGold = new BGold();
                    bGold.initData(bGold);
                    golds.add(bGold);
                    curCount++;
                    if(curCount >= bombCount)return golds;
                }
                var targetPos2 = this.getPosByXAndY(cmX - x, cmY + y);
                if(mapValidPosArray.has(targetPos2)){
                    var id = randomSeedIntByRange(4, 6);
                    var cmGold = new CMGold(id,targetPos2);
                    goldMap.put(String.valueOf(targetPos2),cmGold);
                    var bGold = new BGold();
                    bGold.initData(bGold);
                    golds.add(bGold);
                    curCount++;
                    if(curCount >= bombCount)return golds;
                }
                var targetPos3 = this.getPosByXAndY(cmX + x, cmY - y);
                if(mapValidPosArray.has(targetPos3)){
                    var id = randomSeedIntByRange(4, 6);
                    var cmGold = new CMGold(id,targetPos3);
                    goldMap.set(String.valueOf(targetPos3),cmGold);
                    var bGold = new BGold();
                    bGold.initData(bGold);
                    golds.add(bGold);
                    curCount++;
                    if(curCount >= bombCount) return golds;
                }
                var targetPos4 = this.getPosByXAndY(cmX - x, cmY - y);
                if(mapValidPosArray.has(targetPos4)){
                    var id = randomSeedIntByRange(4, 6);
                    var cmGold = new CMGold(id,targetPos4);
                    goldMap.set(String.valueOf(targetPos4),cmGold);
                    var bGold = new BGold();
                    bGold.initData(bGold);
                    golds.add(bGold);
                    curCount++;
                    if(curCount >= bombCount)return golds;
                }
            }
        }
        offset++;
    }
    return golds;
};

/**
 * 随机生成一个玩家位置
 * @param player
 * @returns {*}
 */
exp.getPlayerPos = function(player){
    var minX = 1;
    var maxX = 99;
    var minY = 1;
    var maxY = 99;

    //在朋友的附近生成玩家
    if(player.pyUserId != null){
        var pyPlayer = this.getPlayer(player.pyUserId);
        var pyPos = pyPlayer.pos;
        minX = this.getPosXByPos(pyPos)-3;
        maxX = this.getPosXByPos(pyPos)+3;
        minY = this.getPosYByPos(pyPos)-4;
        maxY = this.getPosYByPos(pyPos)+4;

        if(minX < 1)minX = 1;
        if(maxX > 99)maxX = 99;
        if(minY < 1)minY = 1;
        if(maxY > 99)maxY = 99;
    }
    while(true){
        var flag = true;
        var x = randomIntByRange(minX,maxX);
        var y = randomIntByRange(minY,maxY);
        var pos = getPosByXAndY(x, y);
        //TODO: 没看懂，不知道改的对不对
        playerMap.values().forEach(function(value){
            if (flag){
                if (value.pos == pos){
                    flag = false;
                }
            }
        });
        if (flag){
            return pos;
        }
    }
};

//TODO 这个rdm不知道是什么
exp.randomIntByRange = function(min, max){
    return Math.abs(rdm.nextInt(max)) + min;
}

exp.getPosXByPos = function(pos){
    return pos % 101;
};

exp.getPosYByPos = function(pos){
    return pos / 101;
};

/**
 * 初始化地图不可用区域
 * @param lines
 */
exp.initMapValidPos = function(lines){
    var mapInvalidArray = [];
    for (var y = 0; y < lines.length; y++){
        var line = lines[y];
        var positions = line.split(",");
        for (var x = 0; x < positions.length; x++){
            var position = positions[x];
            var myX = 2 * x + 1;
            var myY = 2 * y + 1;
            switch (position){
                //这是什么啊................................................
                case 1:
                    this.addLeftInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 2:
                    this.addUpInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 3:
                    this.addLeftInvalidPos(mapInvalidArray, myX, myY);
                    this.addDownInvalidPos(mapInvalidArray, myX, myY);
                    this.addRightInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 4:
                    this.addUpInvalidPos(mapInvalidArray, myX, myY);
                    this.addLeftInvalidPos(mapInvalidArray, myX, myY);
                    this.addDownInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 5:
                    this.addUpInvalidPos(mapInvalidArray, myX, myY);
                    this.addLeftInvalidPos(mapInvalidArray, myX, myY);
                    this.addRightInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 6:
                    this.addUpInvalidPos(mapInvalidArray, myX, myY);
                    this.addDownInvalidPos(mapInvalidArray, myX, myY);
                    this.addRightInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 7:
                    this.addUpInvalidPos(mapInvalidArray, myX, myY);
                    this.addDownInvalidPos(mapInvalidArray, myX, myY);
                    this.addLeftInvalidPos(mapInvalidArray, myX, myY);
                    this.addRightInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 8:
                    this.addRightInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 9:
                    this.addDownInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 10:
                    this.addUpInvalidPos(mapInvalidArray, myX, myY);
                    this.addLeftInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 11:
                    this.addUpInvalidPos(mapInvalidArray, myX, myY);
                    this.addRightInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 12:
                    this.addDownInvalidPos(mapInvalidArray, myX, myY);
                    this.addRightInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 13:
                    this.addDownInvalidPos(mapInvalidArray, myX, myY);
                    this.addLeftInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 14:
                    this.addLeftInvalidPos(mapInvalidArray, myX, myY);
                    this.addRightInvalidPos(mapInvalidArray, myX, myY);
                    break;
                case 15:
                    this.addUpInvalidPos(mapInvalidArray, myX, myY);
                    this.addDownInvalidPos(mapInvalidArray, myX, myY);
                    break;
            }
        }
    }
    var arr = mapInvalidArray.sort();
    var mapSet = new HashSet(arr);
    arr = mapSet.toArray();
    for (var k = arr.length-1;k>=0;k--){
        mapValidPosArray.remove(arr[k])
    }
};

/**
 * 初始化地图宝石
 */
exp.initGolds = function(){
    goldSeed = new Date().getTime();
    var addedGolds = [];
    for(var i = goldMap.size();i < maxGoldCount;i++ ){
        var id = randomSeedIntByRange(1, 3);
        var percent = randomSeedIntByRange(0, 99);
        if(percent < 5)id = 0;
        var cmGold = new CMGold(id,getGoldPos());
        goldMap.set(cmGold.pos, cmGold);
        var bGold = new BGold();
        bGold.initData(cmGold);
        addedGolds.add(bGold);
    }
    eatedPosArray.clear();
    return addedGolds;
};

/**
 * 不知道是干什么用的
 * @param min
 * @param max
 */
exp.randomSeedIntByRange = function(min, max){
    goldSeed = (goldSeed * 9301 + 49297) % 233280;
    var rnd =  goldSeed / 233280.0;
    return rnd * max + min;
};

/**
 * 获取宝石位置
 * @returns {number}
 */
exp.getGoldPos = function () {
    var pos = 0;
    var percent = randomSeedIntByRange(0, 99);
    if(percent < 30 && eatedPosArray.count() > 0){
        var index = randomSeedIntByRange(0, eatedPosArray.size()-1);
        pos = eatedPosArray.get(index);
        eatedPosArray.remove(index);
        mapValidPosArray.remove(pos);
    }else{
        var index = randomSeedIntByRange(0, mapValidPosArray.size()-1);
        pos = mapValidPosArray.get(index);
        mapValidPosArray.remove(index);
    }
    return pos;
};


/**
 * 添加不可用位置（左）
 * @param mapInvalidArray
 * @param x
 * @param y
 */
exp.addLeftInvalidPos = function(mapInvalidArray, x, y){
    mapInvalidArray.push(this.getPosByXAndY(x - 1, y));
    mapInvalidArray.push(this.getPosByXAndY(x - 1, y + 1));
    mapInvalidArray.push(this.getPosByXAndY(x - 1, y - 1));
};

/**
 * 添加不可用位置（右）
 * @param mapInvalidArray
 * @param x
 * @param y
 */
exp.addRightInvalidPos = function(mapInvalidArray, x, y){
    mapInvalidArray.push(this.getPosByXAndY(x + 1, y));
    mapInvalidArray.push(this.getPosByXAndY(x + 1, y + 1));
    mapInvalidArray.push(this.getPosByXAndY(x + 1, y - 1));
};

/**
 * 添加不可用位置（上）
 * @param mapInvalidArray
 * @param x
 * @param y
 */
exp.addUpInvalidPos = function(mapInvalidArray, x, y){
    mapInvalidArray.push(this.getPosByXAndY(x, y + 1));
    mapInvalidArray.push(this.getPosByXAndY(x - 1, y + 1));
    mapInvalidArray.push(this.getPosByXAndY(x + 1, y + 1));
};

/**
 * 添加不可用位置（下）
 * @param mapInvalidArray
 * @param x
 * @param y
 */
exp.addDownInvalidPos = function(mapInvalidArray, x, y){
    mapInvalidArray.push(this.getPosByXAndY(x, y - 1));
    mapInvalidArray.push(this.getPosByXAndY(x - 1, y - 1));
    mapInvalidArray.push(this.getPosByXAndY(x + 1, y - 1));
};
