/**
 * Created by yangyanfei on 6/2/16.
 */



cc.BuilderReader.registerController("GameCtrl",{


    onDidLoadFromCCB:function(){
        // this.initPlayerInfo();
    },

    completedAnimationSequenceNamed:function(animationName){

    },

    //初始化玩家的头像 和 名字
    initPlayerInfo: function () {

        var sfHeadBg,opHeadBg;
        if(GameData.mySide == GAMESIDE.BLUE) {
            sfHeadBg = this["blueHeadNode"];
            opHeadBg = this["redHeadNode"];
        }
        else{
            sfHeadBg = this["redHeadNode"];
            opHeadBg = this["blueHeadNode"];
        }
        //设置头像
        cc.loader.loadImg(SF_INFO.iconUrl, function(err,img){
            var sprite  = new cc.Sprite(img);
            if(sprite){
                var headBgSize = sfHeadBg.getContentSize();
                var headSp = GameTool.getHead(sprite);
                headSp.setScale(headBgSize.width/sprite.getContentSize().width);
                // headSp.setPosition(cc.p(headBgSize.width * 0.5,headBgSize.height * 0.5));
                sfHeadBg.addChild(headSp);
            }
        }.bind(this));

        cc.loader.loadImg(OP_INFO.iconUrl, function(err,img){
            var sprite  = new cc.Sprite(img);
            if(sprite){
                var headBgSize = opHeadBg.getContentSize();
                var headSp = GameTool.getHead(sprite);
                headSp.setScale(headBgSize.width/sprite.getContentSize().width);
                // headSp.setPosition(cc.p(headBgSize.width * 0.5,headBgSize.height * 0.5));
                opHeadBg.addChild(headSp);
            }

        }.bind(this));

        //设置名字
        // this["sfName"].setString(SF_INFO.nickname);
        // this["opName"].setString(OP_INFO.nickname);
    }


});