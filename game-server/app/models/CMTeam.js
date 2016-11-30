var util = require('util');
var BPlayer = require('./BPlayer');
var EntityType = require('../consts/consts').EntityType;
var utils = require('../util/utils');
var HashMap = require('HashMap');

/**
 * Player
 * @param {Object} opts
 * @api public
 */
var teamId = 0;
var teamName = null;
var maxPlayerCount = 0;//队伍里边容纳的最大人数
var score = 0;
var power = 0;
var fullPowerCount = 0;//队伍能量满的次数
var maxPower = 50;//能量爆满时候的分数
var teamBuffTime = 5000;
var playerMap = null;
var exp = module.exports;

function CMTeam(teamId) {
    this.teamId = teamId;
    score = 0;
    maxPlayerCount = 3;
    playerMap = new HashMap();
}

/**
 * 初始化
 * @param userId
 * @param pyUserId
 */
exp.init = function(userId, pyUserId){
    this.userId = userId;
    this.pyUserId = pyUserId;
};


/**
 * 加分处理
 */
exp.addScore = function(addScore){
    score += addScore;
    power += addScore;
    var isMaxPower = this.judgeIsMaxPower();

    playerMap.values().forEach(function(value){
        var cmPlayer = value;
        cmPlayer.teamScore = score;
        cmPlayer.teamPower = power;
    });
    return isMaxPower;
};

/**
 * 减分处理
 * @param subScore
 */
exp.subScore = function(subScore){
    score -= subScore;
    playerMap.values().forEach(function(value){
        var cmPlayer = value;
        cmPlayer.teamScore = score;
    });
};

/**
 * 判断?
 * @returns {boolean}
 */
exp.judgeIsMaxPower = function(){
    if(power >= maxPower){
        fullPowerCount++;
        power = 0;
        return true;
    }
    return false;
};

module.exports = CMTeam;
