/**
 * Created by yangyanfei on 16/1/1.
 */




var TOOLSSEED = 0;



var isRoleInfoReady = false;//是否接收到了所有人物的信息
var isGoldInfoReady = false;//是否接收到了所有金币的信息


var GM_INFO = {
    readyFrames:3,//3代表3 2 1, 2代表ready go,1代表是回合游戏 不用播放
    isEnd:true,
    isFirst :true,
    currSeed:0,
    moveWidth:100,//可以移动的宽
    moveHeight:100,// 可以移动的区域的高
    offset:64,
    resetData:function (){
        this.isEnd = true;
        this.currSeed = this.nextSeed;
    }
};

var GameData ={
    myRole : null,
    map :null,
    _msgLayer:null,
    roleLayer:null,
    diamondLayer:null,
    miniMapLayer:null,
    roleArray : null,
    goldArray : null,
    miniRoleArray : null,
    validPositions:null,

    goldSeed:0,//生成金币的随机数种子
    goldCount:0,//生成金币的数量
    initData:function () {
        // this.myRole = new Role();
        this.roleArray = {};
        this.miniRoleArray = {};

        // this.roleArray["wuxiaofeng"] = "wefwefwe";
        // cc.log(this.roleArray["wuxiaofeng"]);
    },

    addRole:function (player)
    {
        var role ;
        if(player.userId == SF_INFO.userId)
        {
            role = new Role();
            GameData.myRole = role;

        }
        else {
            role = new BaseRole();
        }

        role.userId = player["userId"];
        role.nickname = player["nickname"];
        role.skin = player["skin"];
        role.positionIndex = player["pos"];
        cc.log("rolePositionIndex"+ role.positionIndex);
        role.position = GameTool.getPositionByIndex(role.positionIndex);
        role.state = player["state"];
        role.curScore = player["curScore"];
        role.curRank = player["curRank"];
        this.roleArray[role.userId] = role;
        role.initSprite(role.skin);
        this.roleLayer.addChild(role.node);

        var miniRoleStr = "#map_4.png";

        if(player.userId == SF_INFO.userId)
        {
            miniRoleStr = "#map_2.png";
        }
        else if(player.userId == SF_INFO.pyUserId)
        {
            miniRoleStr = "#map_3.png";
        }
        var miniRole = new cc.Sprite(miniRoleStr);
        role.miniRole = miniRole;
        this.miniMapLayer.addChild(miniRole);
        role.updateMiniMap();

        if(player.userId == SF_INFO.userId)
        {
            GameData.myRole.updateCurrTileProperty();
            cc.eventManager.dispatchCustomEvent(ListenerId.updateScenePositionId);
        }
    },



    addGold:function (gold) {

        var tmpStr,type = gold["type"] ;
        switch (type)
        {
            case 0:
                tmpStr = "#t_1.png";
                break;
            case 1:
                tmpStr = "#diamand/diamond_1.png";
                break;
            case 2:
                tmpStr = "#diamand/diamond_2.png";
                break;
            case 3:
                tmpStr = "#diamand/diamond_3.png";
                break;
            case 4:
                tmpStr = "#diamand/diamond_1.png";
                break;
            case 5:
                tmpStr = "#diamand/diamond_2.png";
                break;
            case 6:
                tmpStr = "#diamand/diamond_3.png";
                break;
            default:
                break;
        }

        var tmpGold = new cc.Sprite(tmpStr);
        if(type == 1|| type == 2 || type == 3)
        {
            tmpGold.setScale(0.7);
        }
        tmpGold.setTag(gold["pos"]);
        tmpGold.setPosition(GameTool.getRealPositionByPosition(GameTool.getPositionByIndex(gold["pos"])));
        this.diamondLayer.addChild(tmpGold);

    },

    removeGoldByIndex :function (index) {
        this.diamondLayer.removeChildByTag(index);
    },



    resetData:function()
    {

    }
};

var SF_INFO = {
    userId:"yangyanfei",//连接上服务器的时候服务器返回的
    pyUserId:null,
    nickname:"杨延飞",//连接上服务器的时候服务器返回的
    skin:"1",
    iconUrl:""
};

getSeedRandom = function(min,max){
    max = max || 1;
    min = min || 0;
    TOOLSSEED = (TOOLSSEED * 9301 + 49297) % 233280;
    var rnd = TOOLSSEED / 233280.0;
    var tmp = min + rnd * (max - min);
    return parseInt(tmp);
};