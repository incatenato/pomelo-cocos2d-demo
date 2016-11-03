/**
 * Created by yangyanfei on 26/10/2016.
 */



var MsgLayer = cc.Layer.extend({

    ctor:function(){
        this._super();

    },
    onEnter:function () {
      this._super();
    },

    onEnterTransitionDidFinish:function(){
        this._super();
        cc.eventManager.addCustomListener(MsgId.msgId_connectSuccess,this.receiveConnectSuccessMsg.bind(this));
        cc.eventManager.addCustomListener(MsgId.msgId_allPlayerInfo,this.receiveAllPlayerInfoMsg.bind(this));
        cc.eventManager.addCustomListener(MsgId.msgId_allGoldInfo,this.receiveAllGoldInfoMsg.bind(this));
        cc.eventManager.addCustomListener(MsgId.msgId_changePosition,this.receiveChangePositionMsg.bind(this));
        cc.eventManager.addCustomListener(MsgId.msgId_kill,this.receiveKillMsg.bind(this));
        cc.eventManager.addCustomListener(MsgId.msgId_eatGold,this.receiveEatGoldMsg.bind(this));
        cc.eventManager.addCustomListener(MsgId.msgId_changeState,this.receiveChangeStateMsg.bind(this));
        network.openConnect();
    },

    onExit:function(){
        this._super();
        cc.eventManager.removeCustomListeners(MsgId.msgId_connectSuccess);
        cc.eventManager.removeCustomListeners(MsgId.msgId_allPlayerInfo);
        cc.eventManager.removeCustomListeners(MsgId.msgId_allGoldInfo);
        cc.eventManager.removeCustomListeners(MsgId.msgId_changePosition);
        cc.eventManager.removeCustomListeners(MsgId.msgId_kill);
        cc.eventManager.removeCustomListeners(MsgId.msgId_eatGold);
        cc.eventManager.removeCustomListeners(MsgId.msgId_changeState);
    },

    sendGetAllInfoMsg:function(){
        var getAllInfoMsg = new GetAllInfoMsg();
        getAllInfoMsg.content.userId = SF_INFO.userId;
        getAllInfoMsg.content.nickname = SF_INFO.nickname;
        getAllInfoMsg.content.skin = SF_INFO.skin;
        getAllInfoMsg.content.pyUserId = SF_INFO.pyUserId;
        network.sendMessage(getAllInfoMsg);
    },

    sendChangePositionMsg:function(pos){
        var changePositionMsg = new ChangePositionMsg();
        changePositionMsg.content.pos = pos;
        network.sendMessage(changePositionMsg);
    },

    receiveConnectSuccessMsg:function () {
        this.sendGetAllInfoMsg();
    },

    receiveAllPlayerInfoMsg:function(event){
        var data = event.getUserData();

        cc.log("sfdafasdfasdf");
        var players = data["players"];
        for (var i in players) {
            var player = players[i];
            GameData.addRole(player);

        }
        isRoleInfoReady = true;//晓峰可以根据这个字段判断游戏是否开始
    },

    receiveAllGoldInfoMsg:function(event){
        cc.log("sfdafasdfasdf");
        var data = event.getUserData();

        var golds = data["golds"];
        cc.log("golds length" + golds.length);
        for (var i in golds) {
            var gold = golds[i];
            // var baseGold = new BaseGold();
            // baseGold.type = gold["type"];
            // baseGold.positionIndex = gold["pos"];
            // GameData.goldArray[baseGold.type] = baseGold;

            GameData.addGold(gold);
        }

        isGoldInfoReady = true;
    },

    receiveChangePositionMsg:function(event){
        var data = event.getUserData();
        var userId = data["userId"];//改变位置的人物
        var posIndex = data["pos"];//改变后的位置索引
        if(userId != SF_INFO.userId)
        {
            GameData.roleArray[userId].moveToPosition(posIndex);
        }

    },

    receiveKillMsg:function(event){
        var data = event.getUserData();

        var killerUserId = data["killerUserId"];//击杀者
        var killedUserId = data["killedUserId"];//被击杀者
        var isEnemied = data["enemied"];//是否是复仇

        var killerRole = GameData.roleArray[killerUserId];
        var killedRole = GameData.roleArray[killedUserId];

        killedRole.setState(2);

    },

    receiveEatGoldMsg:function(event){
        var data = event.getUserData();

        var userId = data["userId"];//吃金币的人
        var score = data["score"];//当前的分数
        var posIndex = data["pos"];//金币的位置(金币的唯一标识)
        cc.log("userId == " + userId);
        GameData.roleArray[userId].updateScore(score);
        GameData.removeGoldByIndex(posIndex);
    },
    receiveChangeStateMsg:function(event){
        var data = event.getUserData();

        var userId = data["userId"];//吃金币的人
        var state = data["state"];//人当前的状态(有可能能杀人了）
        var baseRole = GameData.roleArray[userId];
        baseRole.setState(state);
    }


});