var util = require('util');
var dataApi = require('../util/dataApi');
var EntityType = require('../consts/consts').EntityType;
var logger = require('pomelo-logger').getLogger(__filename);
var area = require('./area');
var PlayerBase = require('./PlayerBase');

/**
 * 玩家进入房间同步数据
 * @param {Object} opts
 * @api public
 */

function EnterGameSyncModel(opts) {
    Entity.call(this, opts);
    this.enterState = opts.enterState;
    this.enrageTag = opts.enrageTag;
    this.maxScore = opts.maxScore;
    this.maxDeads = opts.maxDeads;
    this.maxKills = opts.maxKills;
    this.curContinueKills = opts.curContinueKills;
    this.maxContinueKills = opts.maxContinueKills;
    this.curContinueDeads = opts.curContinueDeads;
    this.maxContinueDeads = opts.maxContinueDeads;
}

util.inherits(EnterGameSyncModel, PlayerBase);

module.exports = EnterGameSyncModel;

EnterGameSyncModel.prototype.refresh = function (score) {
    //TODO
};

/**
 * Parse String to json.
 * It covers object' method
 *
 * @param {String} data
 * @return {Object}
 * @api public
 */
EnterGameSyncModel.prototype.toJSON = function() {
    return {
        enterState: this.enterState,
        enrageTag: this.enrageTag,
        maxScore: this.maxScore,
        maxDeads: this.maxDeads,
        maxKills: this.maxKills,
        curContinueKills: this.curContinueKills,
        maxContinueKills: this.maxContinueKills,
        curContinueDeads: this.curContinueDeads,
        maxContinueDeads: this.maxContinueDeads
    };
};

