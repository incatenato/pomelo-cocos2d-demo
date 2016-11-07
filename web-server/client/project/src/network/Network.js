/**
 * Created by yangyanfei on 15/5/27.
 */


//var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
var NetWork = function(){

    //if(tz.config.gameId == null)tz.config.gameId = "CARTOONMAN_DEBUG";
    //if(tz.config.roomId == null)tz.config.roomId = "room_1";
    //if(tz.config.userId == null)tz.config.userId = "wuxiaofeng";
    //if(tz.config.serverUrl == null)tz.config.serverUrl = "ws://127.0.0.1:3011";
    //if(tz.config.nickname == null)tz.config.nickname = "吴晓峰";
    //if(tz.config.skin == null)tz.config.skin = "2";
    //
    //SF_INFO.userId = tz.config.userId;
    //SF_INFO.pyUserId = tz.config.pyUserId;
    //SF_INFO.nickname = tz.config.nickname;
    //SF_INFO.skin = tz.config.skin;
    //
    //
    //this.url = tz.config.serverUrl+ "?roomId=" + tz.config.roomId+ "&userId=" + tz.config.userId;
    //this.websocket = null;
    //this.connectTimes = 0;

    this.host = "127.0.0.1";
    this.port = "3014";
    this.userId = "1234567890";
    this.nickName = "Hao";
    this.roomId = "demo_room";
    this.playerLevel = 3;
};


NetWork.prototype = {
    openConnect:function() {
        //var self = this;
        //this.websocket = new WebSocket(this.url);
        //cc.log(this.url);
        //this.websocket.onopen = function(evt) {
        //    cc.log("Send Text WS was opened ");
        //    cc.eventManager.dispatchCustomEvent(MsgId.msgId_connectSuccess);
        //};
        //先通过gate网关获取ws连接地址
        queryEntry(this.userId, function(host, port){
            //初始化POMELO组件
            pomelo.init({
                host: host,
                port: port,
                log: true
            }, function() {
                //连接游戏服务器
                var route = "connector.entryHandler.entry";
                pomelo.request(route, {
                    name: this.nickName
                }, function(data) {
                    console.log(data);
                    if(data.error) {
                        showError(DUPLICATE_ERROR);
                        return;
                    }
                    //初始化地图信息
                    pomelo.request("area.playerHandler.enterScene", {name:this.nickName, playerId:data.playerId, level:this.playerLevel}, function(data){
                        //console.log(data.data.area.entities[1].kindName);
                        for (var i in data.data.area.entities){
                            console.log("gold:" + JSON.stringify(data.data.area.entities[i]));
                            //GameData.addGold(g);
                            GameData.addGold();
                        }
                    });
                    //setName();
                    //setRoom();
                    //showChat();
                    //initUserList(data);
                    console.log('okkkk!');
                });
            });
        });

        pomelo.on('addEntities', function(data) {
            //var entities = data.entities;
            //var area = app.getCurArea();
            //if (!area) {
            //    return;
            //}
            //for (var i = 0; i < entities.length; i++) {
            //    var entity = area.getEntity(entities[i].entityId);
            //    if (!entity) {
            //        area.addEntity(entities[i]);
            //    }
            //}
            console.log('addEntities!!! data:' + JSON.stringify(data));
            var player = {};
            player["userId"] = "yangyanfei";
            player["nickname"] = "Hao";
            player["pos"] = 1000;
            player["state"] = 1;
            player["curScore"] = 0;
            player["curRank"] = 0;
            player["skin"] = 1000;
            GameData.addRole(player);
        });

        //Handle remove entities message
        pomelo.on('removeEntities', function(data) {
            var entities = data.entities;
            var area = app.getCurArea();
            var player = area.getCurPlayer();
            for (var i = 0; i < entities.length; i++) {
                if (entities[i] != player.entityId) {
                    area.removeEntity(entities[i]);
                } else {
                    console.log('entities[i], player.entityId', entities[i], player.entityId);
                    console.error('remove current player!');
                }
            }
        });

        // Handle move  message
        pomelo.on('onMove', function(data) {
            var path = data.path;
            var entity = app.getCurArea().getEntity(data.entityId);
            if (!entity) {
                console.error('no character exist for move!' + data.entityId);
                return;
            }

            var sprite = entity.getSprite();
            var sPos = sprite.getPosition();
            sprite.movePath([sPos, data.endPos]);
        });

        // Handle remove item message
        pomelo.on('onRemoveItem', function(data) {
            app.getCurArea().removeEntity(data.entityId);
        });

        // Handle pick item message
        pomelo.on('onPickItem', function(data) {
            var area = app.getCurArea();
            var player = area.getEntity(data.entityId);
            var item = area.getEntity(data.target);
            player.set('score', player.score + data.score);
            player.getSprite().scoreFly(data.score);
            player.getSprite().updateName(player.name + ' - ' + player.score);
            area.removeEntity(item.entityId);
        });

        pomelo.on('rankUpdate', function(data) {
            console.log('rank_update...data:' + JSON.stringify(data));
        });

        // Handle kick out messge, occours when the current player is kicked out
        pomelo.on('onKick', function() {
            console.log('You have been kicked offline for the same account logined in other place.');
            app.changeView("login");
        });

        // Handle disconect message, occours when the client is disconnect with servers
        pomelo.on('disconnect', function(reason) {
            app.changeView("login");
        });

        // Handle user leave message, occours when players leave the area
        pomelo.on('onUserLeave', function(data) {
            var area = app.getCurArea();
            var playerId = data.playerId;
            console.log('onUserLeave invoke!');
            area.removePlayer(playerId);
        });

        /**
         * 错误处理
         * @param evt
         */
        //this.websocket.onerror = function(evt) {
        //    // cc.log("Error was fired ");
        //};

        /**
         * 链接关闭处理
         * @param evt
         */
        //this.websocket.onclose = function(evt) {
            // if(self.connectTimes < 6){
            //     self.connectTimes++;
            //     // self.reconnect();
            // }else{
            //     cc.eventManager.dispatchCustomEvent(MsgId.msgId_webSocketClosed);
            //
            // }

        //};
    },

    /**
     * 重连处理
     */
    //reconnect:function(){
    //    var self = this;
    //    setTimeout(function(){
    //        self.openConnect();
    //    },2000);
    //},
    //
    ////关闭连接
    //closeConnect:function(){
    //    this.websocket.close();
    //},
    //
    ////发送消息
    //sendMessage:function(data){
    //    if (this.websocket && this.websocket.readyState == WebSocket.OPEN){
    //        var content  = JSON.stringify(data.content);
    //        data.content = content;
    //        var jsonStr = JSON.stringify(data);
    //        this.websocket.send(jsonStr);
    //    }
    //},
    //
    ////接收消息
    //receiveMessage:function(data){
    //    var jsonObj = JSON.parse(data);
    //    var userData = JSON.parse(jsonObj.content);
    //    cc.log("派发消息   " + jsonObj.msgId);
    //    cc.eventManager.dispatchCustomEvent(jsonObj.msgId,userData);
    //}
};



var network = new NetWork();


