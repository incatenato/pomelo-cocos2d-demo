var HelloWorldLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            },this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = cc.Menu.create(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.x = size.width / 2;
        this.helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        // add "HelloWorld" splash screen"
        this.sprite = cc.Sprite.create(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        lazyLayer.addChild(this.sprite, 0);

        var rotateToA = cc.RotateTo.create(2, 0);
        var scaleToA = cc.ScaleTo.create(2, 1, 1);

        this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        this.helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));

        pomeloInit();
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});




/**
 * init game scene
 * 1、gate.gateHandler.queryEntry {uid: name}
 * 2、connector.entryHandler.entry  {name: name}
 * 3、area.playerHandler.getAnimation
 */
var pomeloInit = function(host, port, userId, roomId, nickName) {
    var pomelo = window.pomelo;
    var name = nickName;
    var playerId = userId;

    var uid = "uid";
    var rid = "rid";
    var username = "username";
    var route = 'gate.gateHandler.queryEntry';

    //pomelo.init({
    //    host: "127.0.0.1",
    //    port: 3014,
    //    log: true
    //}, function() {
    //    pomelo.request(route, {
    //        uid: uid
    //    }, function(data) {
    //        pomelo.disconnect();
    //        pomelo.init({
    //            host: data.host,
    //            port: data.port,
    //            log: true
    //        }, function() {
    //            var route = "connector.entryHandler.enter";
    //            pomelo.request(route, {
    //                username: username,
    //                rid: rid
    //            }, function(data) {
    //                cc.log(JSON.stringify(data));
    //                chatSend();
    //            });
    //        });
    //    });
    //});


    function chatSend() {
        var route = "chat.chatHandler.send";
        var target = "*";
        var msg = "msg"
        pomelo.request(route, {
            rid: rid,
            content: msg,
            from: username,
            target: target
        }, function(data) {
            cc.log(JSON.stringify(data));
        });
    }



    pomelo.init({host: host, port: port, log: false}, function() {
        //先从网关获取游戏服务器地址／端口
        pomelo.request('gate.gateHandler.queryEntry', {uid:name}, function(data) {
            console.log(data);
            pomelo.disconnect();

            if (data.code === 2001) {
                alert('server error!');
                return;
            }
            if (data.host === '127.0.0.1') {
                data.host = location.hostname;
            }
            console.log(data);
            pomelo.init({host: data.host, port: data.port, log: true}, function() {

                pomelo.request('connector.entryHandler.entry', {name:name}, function(data){
                    console.log(data);
                    pomelo.request('area.playerHandler.enterScene', {name:name, playerId:playerId, level:3}, function(data){
                        //TODO 渲染地图
                        //var json = JSON.parse(data);
                        console.log(data);
                        //json.
                        msgHandler();
                    })
                });
            });
        });
    });


    function msgHandler(){
        // add entities
        pomelo.on('addEntities', function(data) {
            var entities = data.entities;
            var area = app.getCurArea();
            if (!area) {
                return;
            }
            for (var i = 0; i < entities.length; i++) {
                var entity = area.getEntity(entities[i].entityId);
                if (!entity) {
                    area.addEntity(entities[i]);
                }
            }
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
            var ul = document.querySelector('#rank ul');
            var area = app.getCurArea();
            var li = "";
            data.entities.forEach(function(id) {
                var e = area.getEntity(id);
                if (e) {
                    li += '<li><span>' + e.name + '</span><span>' + e.score + '</span></li>';
                }
            });
            ul.innerHTML = li;
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
    }
};



    //entry(name, function() {
    //    loadAnimation(function () {
    //        pomelo.request('connector.entryHandler.entry', {name: name}, function (data) {
    //            pomelo.request("area.playerHandler.enterScene", {
    //                name: name,
    //                playerId: data.playerId
    //            }, function (data) {
    //                //msgHandler.init();
    //                //app.init(data.data);
    //            });
    //        });
    //    });
    //});
    //
    //
    //var jsonLoad = false;
    //var loadAnimation = function(callback) {
    //    if (jsonLoad) {
    //        if (callback) {
    //            callback();
    //        }
    //        return;
    //    }
    //    //获取动画
    //    pomelo.request('area.playerHandler.getAnimation', function(result) {
    //        //dataApi.animation.set(result.data);
    //        jsonLoad = true;
    //        if (callback) {
    //            callback();
    //        }
    //    });
    //};
    //
    //function entry(name, callback) {
    //    pomelo.init({host: '127.0.0.1', port: 3014, log: true}, function() {
    //        pomelo.request('gate.gateHandler.queryEntry', {uid: name}, function(data) {
    //            //pomelo.disconnect();
    //
    //            if (data.code === 2001) {
    //                alert('server error!');
    //                return;
    //            }
    //            if (data.host === '127.0.0.1') {
    //                data.host = location.hostname;
    //            }
    //            // console.log(data);
    //            pomelo.init({host: data.host, port: data.port, log: true}, function() {
    //                if (callback) {
    //                    callback();
    //                }
    //            });
    //        });
    //    });
    //}





