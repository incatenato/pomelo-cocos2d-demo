/**
 * Created by wuxiaofeng on 15/5/27.
 */




var MsgId = {
    msgId_connectSuccess : 99,
    msgId_getAllInfo:100,//请求所有信息
    msgId_allPlayerInfo : 101,//所有玩家信息
    msgId_allGoldInfo : 102,//所有金币信息
    msgId_changePosition : 103,//改变位置
    msgId_kill : 104,//杀人
    msgId_eatGold : 105, //吃金币,
    msgId_changeState : 106//状态改变
};


var GetAllInfoMsg = function(){
    this.msgId = MsgId.msgId_getAllInfo;
    this.content = {
        userId : null,
        pyUserId : null,
        nickname : null,
        skin : null
    }
};

var ChangePositionMsg = function(){
    this.msgId = MsgId.msgId_changePosition;
    this.content = {
        pos : 0
    }
};


