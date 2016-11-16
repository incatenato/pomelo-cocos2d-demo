var util = require('util');
var Entity = require('./entity');
var EntityType = require('../consts/consts').EntityType;
var utils = require('../util/utils');

/**
 * Initialize a new 'Treasure' with the given 'opts'.
 * Item inherits Entity
 *
 * @param {Object} opts
 * @api public
 */

function Gold(opts) {
    Entity.call(this, opts);
    this.name = opts.name;
    this.score = opts.score;
    this.type = opts.type;
}

util.inherits(Gold, Entity);

module.exports = Gold;
