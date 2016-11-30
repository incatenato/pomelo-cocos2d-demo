module.exports = {

  RES_CODE : {
    SUC_OK                  :  1,   // success
    ERR_FAIL								: -1,		// Failded without specific reason
    ERR_USER_NOT_LOGINED		: -2,		// User not login
    ERR_CHANNEL_DESTROYED		: -10,	// channel has been destroyed
    ERR_SESSION_NOT_EXIST   : -11,	// session not exist
    ERR_CHANNEL_DUPLICATE   : -12,	// channel duplicated
    ERR_CHANNEL_NOT_EXIST   : -13		// channel not exist
  },

  MESSAGE: {
    RES: 200,
    ERR: 500,
    PUSH: 600
  },

  /**
   * 玩家状态
   */
  PLAYER_STATE: {
    NORMAL: 0, //不知道
    ENRAGE: 1, //不知道
    DEAD: 2    //死亡
  },

  ENTER_STATE: {
    NORMAL: 0,
    TEAM_LIMIT: 1,
    ROOM_LIMIT: 2
  },

  EntityType: {
    PLAYER: 'player',
    TREASURE: 'treasure',
    GOLD: 'gold'
  }

};

