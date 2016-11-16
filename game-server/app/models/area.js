var EventEmitter = require('events').EventEmitter;
var dataApi = require('../util/dataApi');
var pomelo = require('pomelo');
var ActionManager = require('./action/actionManager');
var timer = require('./timer');
var EntityType = require('../consts/consts').EntityType;
var logger = require('pomelo-logger').getLogger(__filename);
var Gold = require('./gold');

var exp = module.exports;

var id = 0;
var width = 0;
var height = 0;

var actionManager = null;

var players = {};

var entities = {};

var channel = null;

var treasureCount = 0;

var goldCount = 0;

/**
 * 初始化地图
 * @param {Object} opts
 * @api public
 */
exp.init = function (opts) {
    id = opts.id;
    width = opts.width;
    height = opts.height;
    //行为管理器
    actionManager = new ActionManager();
    //生成宝石
    exp.generateGolds(100);
    //area run
    timer.run();
};

/**
 * 获取频道 用于发送信息
 * @type {exports.getChannel}
 */
var getChannel = exp.getChannel = function () {
    if (channel) {
        return channel;
    }
    channel = pomelo.app.get('channelService').getChannel('area_' + id, true);
    return channel;
};

/**
 * 添加事件
 * @param player
 */
function addEvent(player) {
    player.on('pickItem', function (args) {
        var player = exp.getEntity(args.entityId);
        var treasure = exp.getEntity(args.target);
        player.target = null;
        if (treasure) {
            player.addScore(treasure.score);
            exp.removeEntity(args.target);
            getChannel().pushMessage({
                route: 'onPickItem',
                entityId: args.entityId,
                target: args.target,
                score: treasure.score
            });
        }
    });
}

// the added entities in one tick
var added = [];
// the reduced entities in one tick
var reduced = [];
exp.entityUpdate = function () {
    if (reduced.length > 0) {
        getChannel().pushMessage({route: 'removeEntities', entities: reduced});
        reduced = [];
    }
    if (added.length > 0) {
        getChannel().pushMessage({route: 'addEntities', entities: added});
        added = [];
    }
};
/**
 * 在地图上添加物品
 * @param {Object} e Entity to add to the area.
 */
exp.addEntity = function (e) {
    if (!e || !e.entityId) {
        return false;
    }

    entities[e.entityId] = e;

    if (e.type === EntityType.PLAYER) {
        getChannel().add(e.id, e.serverId);
        addEvent(e);

        if (!!players[e.id]) {
            logger.error('add player twice! player : %j', e);
        }
        players[e.id] = e.entityId;
    } else if (e.type === EntityType.TREASURE) {
        treasureCount++;
    } else if (e.type === EntityType.GOLD) {
        goldCount++;
    }

    added.push(e);
    return true;
};

/**
 * 更新排名
 * @type {number}
 */
// player score rank
var tickCount = 0;
exp.rankUpdate = function () {
    tickCount++;
    if (tickCount >= 10) {
        tickCount = 0;
        var player = exp.getAllPlayers();
        player.sort(function (a, b) {
            return a.score < b.score;
        });
        var ids = player.slice(0, 10).map(function (a) {
            return a.entityId;
        });
        getChannel().pushMessage({route: 'rankUpdate', entities: ids});
    }
};

/**
 * 删除物品
 * @param {Number} entityId The entityId to remove
 * @return {boolean} remove result
 */
exp.removeEntity = function (entityId) {
    var e = entities[entityId];
    if (!e) {
        return true;
    }
    if (e.type === EntityType.PLAYER) {
        getChannel().leave(e.id, e.serverId);
        actionManager.abortAllAction(entityId);

        delete players[e.id];
    } else if (e.type === EntityType.TREASURE) {
        treasureCount--;
        if (treasureCount < 25) {
            exp.generateTreasures(15);
        }
    } else if (e.type === EntityType.GOLD) {
        goldCount--;
        //如果宝石数量少于50 增加50个道具
        if (goldCount < 50) {
            exp.generateGolds(50);
        }
    }
    delete entities[entityId];
    reduced.push(entityId);
    return true;
};

/**
 * 在地图上获取物品
 * @param {Number} entityId.
 */
exp.getEntity = function (entityId) {
    return entities[entityId];
};

/**
 * 根据ids获取物品信息
 * @param {Array} The given entities' list.
 */
exp.getEntities = function (ids) {
    var result = [];
    for (var i = 0; i < ids.length; i++) {
        var entity = entities[ids[i]];
        if (entity) {
            result.push(entity);
        }
    }
    return result;
};

/**
 * 获取全部玩家信息
 * @returns {Array}
 */
exp.getAllPlayers = function () {
    var _players = [];
    for (var id in players) {
        _players.push(entities[players[id]]);
    }

    return _players;
};

/**
 * 生成宝石
 * @param n
 */
exp.generateGolds = function (n) {
    if (!n) {
        return;
    }
    for (var i = 0; i < n; i++) {
        var d = dataApi.gold.random();
        var t = new Gold({kindId: d.id, kindName: d.name, score: d.score, type: d.type});
        exp.addEntity(t);
    }
};

/**
 * 获取全部物品信息
 * @returns {{}}
 */
exp.getAllEntities = function () {
    return entities;
};

/**
 * 获取玩家信息
 * @param playerId
 * @returns {*}
 */
exp.getPlayer = function (playerId) {
    var entityId = players[playerId];
    return entities[entityId];
};

/**
 * 移除玩家
 * @param playerId
 */
exp.removePlayer = function (playerId) {
    var entityId = players[playerId];

    if (entityId) {
        delete players[playerId];
        this.removeEntity(entityId);
    }
};

/**
 * Get area entities for given postion and range.
 */
exp.getAreaInfo = function () {
    var entities = this.getAllEntities();
    return {
        id: id,
        entities: entities,
        width: width,
        height: height
    };
};

exp.initAreaInfo = function () {
    var entities = this.getAllEntities();
    return {
        id: id,
        entities: entities,
        width: width,
        height: height
    };
}

exp.width = function () {
    return width;
};

exp.height = function () {
    return height;
};

exp.entities = function () {
    return entities;
};

exp.actionManager = function () {
    return actionManager;
};

exp.timer = function () {
    return timer;
};

