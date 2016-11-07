/**
 * Created by yangyanfei on 6/6/16.
 */


var GameTool = {
    _listeners: [],
    getHead: function (sp) {
        sp.setScaleX(GM_INFO.headWidth / sp.getContentSize().width);
        sp.setScaleY(GM_INFO.headHeight / sp.getContentSize().height);
        // var stencil = new cc.Sprite("#head_stencil.png");
        // var clipper = new cc.ClippingNode(stencil);
        // clipper.addChild(sp);
        // clipper.setAlphaThreshold(0);
        return sp;
    },

    getTip: function () {
        var index = Math.floor(Math.random() * 4);
        switch (index) {
            case 0:
            {
                return "注意射箭节奏，草率的射箭只会浪费进攻机会。";
            }
            case 1:
            {
                return "根据气泡类型合理进攻，后发制人是个不错的选择。";
            }
            case 2:
            {
                return "直接击中对手可影响其得分效率。";
            }
            case 3:
            {
                return "射击的时注意躲避对手的箭矢。";
            }
            default:
            {
                return "游戏结束，积分高者获胜。";
            }
        }
    },

    addCustomListener: function (msgId, callback, target) {
        cc.eventManager.addCustomListener(msgId, callback.bind(target));
        this._listeners.push(msgId);
    },
    removeCustomListeners: function () {
        var length = this._listeners.length, i, listener;
        for (i = 0; i < length; i++) {
            listener = this._listeners[i];
            cc.eventManager.removeCustomListeners(listener);
        }
    },

    getNowDate: function () {
        return new Date().getTime();
    },

    judgeBalloonLegal: function (postion) {
        if (postion.x < 0 || postion.x > 900 || postion.y > 0 || postion.y < -540) {
            return false;
        }
        return true;
    },

    getPointDistance: function (p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    },

    getNearestDistance: function (PA, PB, P3) {
        var a, b, c;
        a = this.getPointDistance(PB, P3);
        if (a <= 0.00001)
            return 0;
        b = this.getPointDistance(PA, P3);
        if (b <= 0.00001)
            return 0;
        c = this.getPointDistance(PA, PB);
        if (c <= 0.00001)
            return a;//如果PA和PB坐标相同，则退出函数，并返回距离
        //------------------------------
        if (a * a >= b * b + c * c)
            return b;
        if (b * b >= a * a + c * c)
            return a;

        var l = (a + b + c) / 2;     //周长的一半
        var s = Math.sqrt(l * (l - a) * (l - b) * (l - c));  //海伦公式求面积
        return 2 * s / c;
    },

    getPositionByIndex: function (index) {
        return cc.p(index % 101, Math.floor(index / 101));
    },

    getIndexByPosition: function (pos) {
        return pos.y * 101 + pos.x;
    },

    getRealPositionByPosition: function (position) {
        return cc.p(GM_INFO.offset / 2 * position.x, GM_INFO.offset / 2 * position.y);
    },

    getTilePositionByPosition: function (position) {
        var x = Math.floor((position.x - 1) * 0.5);
        var y = Math.floor((position.y - 1) * 0.5);
        // var pos = null;
        //
        // var re = /^[1-9]+[0-9]*]*$/;
        //
        //
        // if(re.test(x)&& re.test(y))
        // {
        //     pos = ;
        // }
        return cc.p(x, 49 - y);
    },

    getRealPositionByTilePosition: function (position) {
        return cc.p(GM_INFO.offset / 2 + (position.x * 2) * GM_INFO.offset, GM_INFO.offset / 2 + (49 - position.y * 2) * GM_INFO.offset);

    },

    getIndexByTilePosition: function (position) {
        return (position.x * 2 + 1) + (position.y * 2 + 1) * 100;
    },


    getNextPositionByPosAndMoveType: function (pos, type) {
        var toAddPos;
        switch (type) {
            case 0:
                toAddPos = cc.p(1, 0);
                break;
            case 1:
                toAddPos = cc.p(-1, 0);
                break;
            case 2:
                toAddPos = cc.p(0, 1);
                break;
            case 3:
                toAddPos = cc.p(0, -1);
                break;
            default:
                break;
        }


        return cc.pAdd(pos, toAddPos);
    },

    getIslegalForTile: function (pos) {
        return (pos.x % 2 == 1 && pos.y % 2 == 1);
    },


    getRandom: function () {

    }
};