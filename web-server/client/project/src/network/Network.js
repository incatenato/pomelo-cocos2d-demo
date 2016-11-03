/**
 * Created by yangyanfei on 15/5/27.
 */


var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

var NetWork = function(){

    if(tz.config.gameId == null)tz.config.gameId = "CARTOONMAN_DEBUG";
    if(tz.config.roomId == null)tz.config.roomId = "room_1";
    if(tz.config.userId == null)tz.config.userId = "wuxiaofeng";
    if(tz.config.serverUrl == null)tz.config.serverUrl = "ws://127.0.0.1:3011";
    if(tz.config.nickname == null)tz.config.nickname = "吴晓峰";
    if(tz.config.skin == null)tz.config.skin = "2";

    SF_INFO.userId = tz.config.userId;
    SF_INFO.pyUserId = tz.config.pyUserId;
    SF_INFO.nickname = tz.config.nickname;
    SF_INFO.skin = tz.config.skin;


    this.url = tz.config.serverUrl+ "?roomId=" + tz.config.roomId+ "&userId=" + tz.config.userId;
    this.websocket = null;
    this.connectTimes = 0;

};


NetWork.prototype = { // 定义Person的prototype域

    //开启连接
    openConnect:function() {   // 定义一个print函数

        var self = this;
        this.websocket = new WebSocket(this.url);
        cc.log(this.url);
        this.websocket.onopen = function(evt) {
            cc.log("Send Text WS was opened ");
            cc.eventManager.dispatchCustomEvent(MsgId.msgId_connectSuccess);
        };

        this.websocket.onmessage = function(evt) {

            var jsonObj = JSON.parse(evt.data);

            cc.log("收到消息 msgId = " + jsonObj.msgId);
            self.receiveMessage(evt.data);

        };

        this.websocket.onerror = function(evt) {
            // cc.log("Error was fired ");
        };

        this.websocket.onclose = function(evt) {
            // if(self.connectTimes < 6){
            //     self.connectTimes++;
            //     // self.reconnect();
            // }else{
            //     cc.eventManager.dispatchCustomEvent(MsgId.msgId_webSocketClosed);
            //
            // }

        };
    },

    reconnect:function(){
        var self = this;
        setTimeout(function(){
            self.openConnect();
        },2000);
    },

    //关闭连接
    closeConnect:function(){
        this.websocket.close();
    },

    //发送消息
    sendMessage:function(data){
        if (this.websocket && this.websocket.readyState == WebSocket.OPEN){
            var content  = JSON.stringify(data.content);
            data.content = content;
            var jsonStr = JSON.stringify(data);
            this.websocket.send(jsonStr);
        }
    },

    //接收消息
    receiveMessage:function(data){
        var jsonObj = JSON.parse(data);
        var userData = JSON.parse(jsonObj.content);
        cc.log("派发消息   " + jsonObj.msgId);
        cc.eventManager.dispatchCustomEvent(jsonObj.msgId,userData);
    }
};

var network = new NetWork();


