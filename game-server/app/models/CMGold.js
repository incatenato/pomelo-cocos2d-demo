var util = require('util');
var BGold = require('./BGold');
var EntityType = require('../consts/consts').EntityType;
var utils = require('../util/utils');

/**
 * Initialize a new 'CMGold' with the given 'opts'.
 * Item inherits Entity
 *
 * @param {Object} opts
 * @api public
 */

function CMGold(type, pos) {
    this.type = type;
    this.pos = pos;
    //用枚举重写 TODO
    if(type == 0){
        this.score = 0;
    }else if(type < 4){
        this.score = 1;
    }else{
        this.score = 5;
    }
}

//继承
util.inherits(CMGold, BGold);

module.exports = CMGold;
