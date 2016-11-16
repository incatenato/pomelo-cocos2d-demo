var util = require('util');
var EntityType = require('../consts/consts').EntityType;
var utils = require('../util/utils');

/**
 * Initialize a new 'GoldBase' with the given 'opts'.
 * Item inherits Entity
 *
 * @param {Object} opts
 * @api public
 */

function BGold(type, pos) {
    this.type = type;
    this.pos = pos;
}

module.exports = BGold;

/**
 * 初始化对象
 * @param instance
 */
BGold.prototype.initData = function(instance){
    this.type = instance.type;
    this.pos = instance.pos;
};