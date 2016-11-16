var util = require('util');
var Entity = require('./entity');
var dataApi = require('../util/dataApi');
var EntityType = require('../consts/consts').EntityType;
var logger = require('pomelo-logger').getLogger(__filename);
var area = require('./area');

/**
 * Player base
 * @param {Object} opts
 * @api public
 */

function PlayerBase(opts) {
    Entity.call(this, opts);
    this.userId = opts.userId;
    this.pyUserId = opts.pyUserId;
    this.nickname = opts.nickName;
    this.skin = opts.skin;
    this.teamId = opts.teamId;
    this.teamName = opts.teamName;
    this.power = opts.power;
    this.speed = opts.speed;
    this.teamPower = opts.teamPower;
    this.teamScore = opts.teamScore;
    this.curKills = opts.curKills;
    this.curDeads = opts.curDeads;
    this.pos = opts.pos;
    this.state =  opts.state;
    this.curScore = opts.curScore;
    this.curRank = opts.curRank;
}


module.exports = PlayerBase;

PlayerBase.prototype.addScore = function (score) {
    this.score += score;
};

/**
 * Parse String to json.
 * It covers object' method
 *
 * @param {String} data
 * @return {Object}
 * @api public
 */
PlayerBase.prototype.toJSON = function() {
    return {
        userId:this.userId,
        pyUserId:this.pyUserId,
        nickname:this.nickname,
        skin:this.skin,
        teamId:this.teamId,
        teamName:this.teamName,
        power:this.power,
        speed:this.speed,
        teamPower:this.teamPower,
        teamScore:this.teamScore,
        curKills:this.curKills,
        curDeads:this.curDeads,
        pos:this.pos,
        state:this.state,
        curScore:this.curScore,
        curRank:this.curRank
    };
};

