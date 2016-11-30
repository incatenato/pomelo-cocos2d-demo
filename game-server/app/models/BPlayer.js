this.util = require('util');
this.EntityType = require('../consts/consts').EntityType;
this.utils = require('../util/utils');

/**
 * Initialize a new 'GoldBase' with the given 'opts'.
 * Item inherits Entity
 *
 * @param {Object} opts
 * @api public
 */

function BPlayer(opts) {
    this.userId = opts.userId;
    this.pyUserId = opts.pyUserId;
    this.nickname = opts.nickname;
    this.skin = opts.skin;
    this.teamId = opts.teamId;
    this.teamName = opts.teamName;
    this.state = opts.state;
    this.pos = opts.pos;
    this.speed = opts.speed;
    this.score = opts.score;
    this.power = opts.power;
    this.teamScore = opts.teamScore;
    this.teamPower = opts.teamPower;
    this.kills = opts.kills;
    this.deads = opts.deads;
}

module.exports = BPlayer;

/**
 * 初始化对象
 * @param instance
 */
BPlayer.prototype.initData = function(instance){
    this.userId = instance.userId;
    this.pyUserId = instance.pyUserId;
    this.nickname = instance.nickname;
    this.skin = instance.skin;
    this.teamId = instance.teamId;
    this.teamName = instance.teamName;
    this.state = instance.state;
    this.pos = instance.pos;
    this.speed = instance.speed;
    this.score = instance.score;
    this.power = instance.power;
    this.teamScore = instance.teamScore;
    this.teamPower = instance.teamPower;
    this.kills = instance.kills;
    this.deads = instance.deads;
};