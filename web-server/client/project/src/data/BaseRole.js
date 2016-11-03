/**
 * Created by yangyanfei on 26/10/2016.
 */





var BaseRole = function(name){
    this.userId = "";
    this.nickname = "";
    this.skin = "";
    this.state = 0;//0正常状态，1攻击状态,2死亡状态
    this.curScore = 0;//当前分数
    this.curRank = 0;//当前排名
    this.speed = 0.2;
    this.positionIndex = null;
    this.node = new cc.Node();


    this.nameLabel = new cc.LabelTTF("","Arial",14);
    this.node.addChild(this.nameLabel);
    this.nameLabel.setPosition(cc.p(0,43));
    this.nameLabel.setLocalZOrder(99);


    this.scoreLabel = new cc.LabelTTF("","Arial",13);
    this.node.addChild(this.scoreLabel);
    this.scoreLabel.setPosition(cc.p(0,58));
    this.scoreLabel.setLocalZOrder(100);
    this.scoreLabel.setColor(cc.color(200,0,0));

    this.moveArray = [];
    this.moveType =  -1;
    this.speed = 0.2;
    this.position = null;

    this.setState = function(state){
        this.state = state;
        switch (this.state){
            case 1:
            {
                //播动画什么的  你处理吧
                break;
            }

            case 2://死亡状态
            {
                //播动画什么的  你处理吧
                break;
            }
            default:
            {
                //默认是0  就是正常状态应该不用处理
            }
        }
    };

    this.updateScore = function (score) {
        this.curScore = score;
        this.scoreLabel.setString(this.curScore);
    };


    this.updateMiniMap = function () {
        var miniPosition = cc.p(134*(this.position.x/100),134*(this.position.y/100));
        this.miniRole.setPosition(miniPosition);
    };


    this.initSprite = function (spriteIndex) {
        var headUrl = "http://ofw6tymxy.bkt.clouddn.com/head_"+spriteIndex+".png";
        cc.loader.loadImg(headUrl, function(err,img){
            var sprite  = new cc.Sprite(img);
            this.node.addChild(sprite);
        }.bind(this));
        this.nameLabel.setString(this.nickname);
        this.node.setPosition(GameTool.getRealPositionByPosition(this.position));
    };


    this.moveActionByType = function (moveType) {
        var nextPos = GameTool.getNextPositionByPosAndMoveType(this.position , moveType);
        this.baseRoleMoveAction(nextPos,this.moveEnd);
        this.moveType = moveType;
        GameData._msgLayer.sendChangePositionMsg(GameTool.getIndexByPosition(this.position));
    };

    this.baseRoleMoveAction = function (nextPos, func) {
        var seq = new cc.Sequence(new cc.MoveTo(this.speed,GameTool.getRealPositionByPosition(nextPos)) , new cc.CallFunc(func.bind(this)));
        this.position = nextPos;
        this.node.runAction(seq);
        this.updateMiniMap();
    };

    this.moveToPosition = function (positionIndex) {
        var length = this.moveArray.length;
        this.positionIndex = positionIndex;
        this.position = GameTool.getPositionByIndex(positionIndex);
        switch (length)
        {
            case 0:
                this.moveArray.push(positionIndex);
                this.baseRoleMoveAction(this.position,this.baseMoveEnd);
                break;
            default:
                this.moveArray.push(positionIndex);
                break;
        }
    };

    this.baseMoveEnd = function () {
        this.moveArray.shift();
        var length = this.moveArray.length;
        switch (length)
        {
            case 0:
               break;
            case 1:
            case 2:
            case 3:
                this.positionIndex = this.moveArray[0];
                this.position = GameTool.getPositionByIndex(this.positionIndex);
                this.baseRoleMoveAction(this.position,this.baseMoveEnd);
                break;
            default:
                this.positionIndex = this.moveArray[length-1];
                this.position = GameTool.getPositionByIndex(this.positionIndex);
                this.moveArray.splice(0,length-1);
                this.baseRoleMoveAction(this.position,this.baseMoveEnd);
                break;
        }


    };

};