/**
 * 这个Scene做房间分配
 * Created by yangyanfei on 15/5/23.
 */

var LoadingScene = cc.Scene.extend({
    _isLoaded: false,
    _isJump: false,
    _isPlayerInfo: false,
    _loadingCtrl: null,
    onEnter: function () {
        this._super();
        this.addListeners();
        this.loadLoading();
    },

    onExit: function () {
        this._super();
       cc.eventManager.removeCustomListeners();

    },

    addListeners: function () {
    },

    loadLoading: function () {
        var self = this;
        cc.loader.load(g_resources_loading,
            function (result, count, loadedCount) {
                cc.log("111"+"count"+count+"loadedCount" +loadedCount);
            }, function () {

                var node = cc.BuilderReader.load(res_loading.loading_ccb, self);
                self._loadingCtrl = node.controller;
                if(node != null) {
                    self.addChild(node);
                }
                self.loadGaming();
                self.loadMusic();
                self.scheduleUpdate();
                self.openConnect();
                // if (!global_debug) {
                //     hideLogo();
                // }
            });
    },

    loadMusic: function () {
        cc.loader.load(res_music_array,
            function (result, count, loadedCount) {
            }, function () {
            });
    },

    loadGaming: function () {
        var self = this;
        cc.loader.load(g_resources_gaming,
            function (result, count, loadedCount) {
                var percent = ((loadedCount + 1) / count * 100) | 0;
                percent = Math.min(percent, 100);

                SF_INFO.loadingPercent = percent;
            }, function () {
                self._isLoaded = true;
                cc.log("_isLoaded = true");
            });
    },

    openConnect: function () {
        var jsonObj = null;
        // if (global_debug) {
        //     var str = '{"roomId":"room_1","gameId":"SHOOTINGFIGHTS_DEBUG","userId":"userId2","sessionKey":1,"gameServerIP":"ws://192.168.0.17:8080/game-shootingfights/game"}';
        //     // var str = '{"roomId":"room_1","gameId":"MUTUALSHOOT_DEBUG","userId":"userId1","sessionKey":1,"gameServerIP":"ws://192.168.0.199:8080/game-MutualShoot/game"}';
        //     jsonObj = JSON.parse(str);
        // } else {
        //     var arr = window.location.href.split("?");
        //     var str = decodeURIComponent(arr[1]);
        //     jsonObj = JSON.parse(str);
        // }
        // global_roomId = jsonObj["roomId"];
        // global_gameId = jsonObj["gameId"];
        // global_userId = jsonObj["userId"];
        // global_serverUrl = jsonObj["gameServerIP"];
        // global_network = new NetWork(global_serverUrl);
        // global_network.openConnect();
    },

    update: function (dt) {
        //接受到开始消息后跳转到游戏场景
        if(this._isLoaded){
        //     GameData.mySide = GAMESIDE.RED;
        // if (this._isLoaded && this._isPlayerInfo && (this._isJump || OP_INFO.isExit)) {
            cc.log("跳转场景");
            this.unscheduleUpdate();
            cc.director.runScene(new cc.TransitionFade(0.8, new GameScene()));
        }
    },


    receiveExitMsg: function () {
        SF_INFO.isWin = true;
        OP_INFO.isExit = true;
        cc.log("OP_INFO.isExit = true");
    },

    receiveJumpMsg: function (event) {
        var data = event.getUserData();
        TOOLSSEED = data.seed;
        this._isJump = true;
    },

    receiveLoadingMsg:function (event) {
        var data = event.getUserData();
        if (data.belong) {
            if (GameData.mySide === GAMESIDE.BLUE) {
                this._loadingCtrl.leftPercent.setString(data.percent+"%");
            }
            else if (GameData.mySide === GAMESIDE.RED)
            {
                this._loadingCtrl.rightPercent.setString(data.percent+"%");
            }
        }
        else {
            if (GameData.mySide === GAMESIDE.RED) {
                this._loadingCtrl.leftPercent.setString(data.percent+"%");
            }
            else if (GameData.mySide === GAMESIDE.BLUE)
            {
                this._loadingCtrl.rightPercent.setString(data.percent+"%");
            }
        }
    },

    receiveSideMsg:function (event) {
        var data = event.getUserData();
        if(data.side )
        {
            GameData.mySide = GAMESIDE.BLUE;
        }
        else
        {
            GameData.mySide = GAMESIDE.RED;
        }
        if (this._isPlayerInfo) {
            if (GameData.mySide === GAMESIDE.BLUE) {
                this._loadingCtrl.rightName.setString(OP_INFO.nickname);
                this._loadingCtrl.leftName.setString(SF_INFO.nickname);
            }
            else if (GameData.mySide === GAMESIDE.RED)
            {
                this._loadingCtrl.leftName.setString(OP_INFO.nickname);
                this._loadingCtrl.rightName.setString(SF_INFO.nickname);
            }
        }
    }

});

