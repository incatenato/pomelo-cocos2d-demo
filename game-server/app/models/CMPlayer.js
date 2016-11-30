var util = require('util');
var BPlayer = require('./BPlayer');
var EntityType = require('../consts/consts').EntityType;
var utils = require('../util/utils');

/**
 * Player
 * @param {Object} opts
 * @api public
 */
var enterState = EntityType.ENTER_STATE.NORMAL;
var maxScore = 0;
var maxDeads = 0;
var maxKills = 0;
var curContinueKills = 0;
var maxContinueKills = 0;
var curContinueDeads = 0;
var maxContinueDeads = 0;
var enrageTag = null;
var enrageTime = 0;
var teamBuffTime = 0;
var enraging = null;
var teamBuffing = null;
var enemyUserId = null;
var exp = module.exports;

function CMPlayer(opts) {
    maxScore = opts.maxScore;//最大分数
    maxDeads = opts.maxDeads;//最大死亡数
    maxKills = opts.maxKills;//最大杀人数
    curContinueKills = opts.curContinueKills;//当前连续杀人数
    maxContinueKills = opts.maxContinueKills;//最大连续杀人数
    curContinueDeads = opts.curContinueDeads;//当前连续死亡数
    maxContinueDeads = opts.maxContinueDeads;//最大连续死亡数

    enrageTag = opts.enrageTag;//暴走定时器的tag
    enrageTime = opts.enrageTime;//狂暴的时间
    teamBuffTime = opts.teamBuffTime;
    enraging = opts.enraging;
    teamBuffing = opts.teamBuffing;
    enemyUserId = opts.enemyUserId;//击杀自己的人
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
 * 消灭对手处理
 */
exp.kill = function(){
    this.kills ++;
    if(this.kills > maxKills){
        maxKills = this.kills;
    }
    curContinueKills++;
    if(curContinueKills > maxContinueKills){
        maxContinueKills = curContinueKills;
    }
    this.kills = 0;
    curContinueDeads = 0;
};

/**
 * 死亡处理
 * @param player
 */
exp.dead = function(player){
    enemyUserId = player.userId;
    state = EntityType.DEAD;
    score = 0;
    power = 0;
    speed = 10;
    curContinueKills = 0;
    this.deads ++;
    if(this.deads > maxDeads)maxDeads = deads;
    curContinueDeads++;
    if(curContinueDeads > maxContinueDeads)maxContinueDeads = curContinueDeads;
};

/**
 * 加分处理
 */
exp.addScore = function(score){
    this.addPowerByScore(score);
    this.score += score;
    if(this.score > this.maxScore)this.maxScore = this.score;
};

/**
 * Unknown
 */
exp.addPowerByScore = function(){
    var region = 1;
    if(this.score <= 20){
        region = 1;
    }else if(this.score <= 60){
        region = 2;
    }else if(this.score <= 140){
        region = 3;
    }else if(this.score <= 300){
        region = 4;
    }else if(this.score <= 620){
        region = 5;
    }else if(this.score <= 1260){
        region = 6;
    }else if(this.score <= 2540){
        region = 7;
    }
    this.power += 640/(Math.pow(2, region) * 10) * addScore;
};

/**
 * 开始暴走处理
 */
exp.beginEnrage = function(){
    if(!this.enraging)this.speed += 2;
    this.enraging = true;
    this.enrageTime = Math.round((1400/448 * this.power));
    this.state = EntityType.PLAYER_STATE.ENRAGE;
};

/**
 * 停止暴走处理
 */
exp.stopEnrage = function(){
    this.speed -= 2;
    this.enraging = false;
    this.enrageTime = 0;
    this.state = EntityType.PLAYER_STATE.NORMAL;
};

/**
 * 开启团队BUFF处理
 */
exp.beginTeamBuff = function(){
    if(!this.teamBuffing)this.speed += 2;
    this.teamBuffing = true;
    this.teamBuffTime = 5000;
};

/**
 * 停止团队BUFF处理
 */
exp.stopTeamBuff = function(){
    this.speed -= 2;
    this.teamBuffing = false;
    this.teamBuffTime = 0;
};



//继承
util.inherits(CMPlayer, BPlayer);

module.exports = CMPlayer;
