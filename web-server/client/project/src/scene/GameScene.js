/**
 * 这个scene做游戏逻辑
 * Created by yangyanfei on 16/1/1.
 */


var GameLayer = cc.Layer.extend({
    _moveType :null,
    _touchMoveBeginPos : null,
    _currTileProperty : null,


    _msgLayer:null,/***杨延飞***/


    ctor: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res_gaming.img_1_plist);
        cc.spriteFrameCache.addSpriteFrames(res_gaming.diamond_plist);
        var node = cc.BuilderReader.load(res_gaming.game_ccb, this);
        this._control = node.controller;
        if(node != null) {
            this.addChild(node);
        }
        this.addMapBG();
        this.addTileMap();
        this.addCustomListener();
        /***杨延飞-begin***/
        GameData._msgLayer = new MsgLayer();
        this.addChild(GameData._msgLayer);
        // // this.schedule(function(){
        // //     GameData._msgLayer.sendGetAllInfoMsg();
        // // },10);
        // GameData._msgLayer.sendGetAllInfoMsg();
        /***杨延飞-end***/
        GameData.diamondLayer = new cc.Layer();
        this._control.itemNode.addChild(GameData.diamondLayer);

        GameData.roleLayer = new cc.Layer();
        this._control.itemNode.addChild(GameData.roleLayer);

        GameData.miniMapLayer = this._control.miniMap;
        //pomeloInit();
    },

    initData : function () {
        GameData.initData();
    },

    addMapBG:function () {
        var bgBatchNode = new cc.SpriteBatchNode(res_gaming.floor);
        this._control.mapNode.addChild(bgBatchNode);
        for(var i = 0 ; i < 60; i ++)
        {
            for(var j = 0 ; j <  60 ; j ++)
            {
                var bgBatchNodeSprite = new cc.Sprite(bgBatchNode.getTexture());
                bgBatchNode.addChild(bgBatchNodeSprite);
                bgBatchNodeSprite.setPosition(cc.pSub(cc.p(i*64,j*64),cc.p(400,400)));
            }

        }
    },

    addTileMap:function () {
        GameData.map = new cc.TMXTiledMap(res_gaming.map_1);
        this._control.mapNode.addChild(GameData.map);
    },

    onEnterTransitionDidFinish: function ()
    {
        this._super();
        cc.audioEngine.setMusicVolume(0.4);
        this.scheduleUpdate();
        this.initData();
    },

    addCustomListener : function () {
        cc.eventManager.addCustomListener(ListenerId.updateScenePositionId,this.beginUpdateScenePostion.bind(this));
    },

    beginUpdateScenePostion :function () {
        this.updateScenePostion();
        this.schedule(this.updateScenePostion);
        this.initTouch();
    },

    initTouch: function () {
        cc.eventManager.addListener({
            //规定事件监听为 ONE_BY_ONE
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //允许触摸传递
            swallowTouches: true,
            //触摸开始onTouchBegan
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
            onTouchCancelled: this.onTouchCancelled.bind(this)
        }, this);

    },


    onTouchBegan: function (touch, event) {

        var touches = touch.getLocation();
        if (touches) {

            this._touchMoveBeginPos = touches;
        }

        return true;
    },

    onTouchMoved: function (touch, event) {

        var touches = touch.getLocation();
        if (touches) {

        }
    },


    //moveType  0 moveRight  1 : moveLeft  2: moveUp   3 : moveDown
    onTouchEnded: function (touch, event) {
        var offsetPos,moveType,
            touchPos = touch.getLocation(),

        offsetPos = cc.pSub(touchPos, this._touchMoveBeginPos);
        if(Math.abs(offsetPos.x)>Math.abs(offsetPos.y))
        {
            if(offsetPos.x > 0)
            {
                moveType = 0;
            }
            else
            {
                moveType = 1;
            }
        }
        else{
            if(offsetPos.y > 0)
            {
                moveType = 2;
            }
            else
            {
                moveType = 3;
            }
        }
        if(GameData.myRole)
        {
            GameData.myRole.updateMoveList(moveType);
        }
    },



    onTouchCancelled: function (touch, event) {

    },




    update:function (dt) {
        // GameData.myRole.updateMoveList();
        // this.updateScenePostion();
        this.updateTileProperty();
    },

    updateTileProperty : function () {

        // cc.log("test" + this._currTileProperty. type);
    },
    
    updateScenePostion:function () {
        var viewCenterPoint = cc.p(cc.winSize.width * 0.5,cc.winSize.height * 0.5);
        var rolePosition = GameData.myRole.node.getPosition();
        var scenePosition = this.getPosition();

        // var x = Math.max(rolePosition.x,viewCenterPoint.x);
        // var y = Math.max(rolePosition.y,viewCenterPoint.y);
        //
        // x = Math.min(x,this._map.width - viewCenterPoint.x);
        // y = Math.min(y,this._map.height - viewCenterPoint.y);
        // var actualPoint = cc.p(x,y);

        var viewPoint = cc.pSub(cc.p(0,0) , rolePosition);

        var offsetPosition = cc.pAdd(rolePosition , cc.pSub(scenePosition,viewCenterPoint));

        if(Math.abs(offsetPosition.x) > GM_INFO.moveWidth )
        {
            if(offsetPosition.x>0)
            {
                this._control.showNode.setPositionX(viewPoint.x + GM_INFO.moveWidth + viewCenterPoint.x);
            }
            else
            {
                this._control.showNode.setPositionX(viewPoint.x - GM_INFO.moveWidth + viewCenterPoint.x);
            }
        }

        if( Math.abs(offsetPosition.y)> GM_INFO.moveHeight)
        {
            if(offsetPosition.y>0)
            {
                this._control.showNode.setPositionY(viewPoint.y + GM_INFO.moveHeight + viewCenterPoint.y);
            }
            else
            {
                this._control.showNode.setPositionY(viewPoint.y - GM_INFO.moveHeight + viewCenterPoint.y);
            }
        }

    }


});

var GameScene = cc.Scene.extend({
    ctor:function(){
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

