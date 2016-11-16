/**
 * Created by wu on 9/13/16.
 */

var Role = function () {

    this.terminalProperties = null;
    this.miniRole = null;
    BaseRole.call(this);
    this.updateCurrTileProperty = function () {
        if (GameTool.getIslegalForTile(this.position)) {
            var tileGID = GameData.map.getLayer("wallLayer").getTileGIDAt(GameTool.getTilePositionByPosition(this.position));
            // cc.log("tileGid " + tileGID);
            if (tileGID) {
                this.terminalProperties = GameData.map.getPropertiesForGID(tileGID).type;
            }
            else {
                this.terminalProperties = 15;
            }

        }
        else {
            // this.terminalProperties = 5;
            if (this.position.x % 2 == 1) {
                this.terminalProperties = 8;
            }
            else if (this.position.y % 2 == 1) {
                this.terminalProperties = 9;
            }
        }
    };


    this.updateMoveList = function (moveType) {

        var arrayLength = this.moveArray.length;


        switch (this.getRelationBy(moveType, this.moveType)) {
            case 0:
                if (arrayLength == 2) {
                    this.moveArray.splice(1, arrayLength - 1);
                }
                return;

                break;
            case 1:
            case 2:{
                if (arrayLength == 0) {
                    this.moveArray.push(moveType);
                }
                else if (arrayLength == 1) {
                    this.moveArray.push(moveType);
                }
                else {
                    this.moveArray.splice(1, arrayLength - 1);
                    this.moveArray.push(moveType);
                }
            }
                break;
            default:
                break;
        }

        arrayLength = this.moveArray.length;
        if (arrayLength == 1) {
            if (this.getCanMoveOn(moveType)) {
                //here
                this.moveActionByType(moveType);
                this.updateCurrTileProperty();
            }
            else {
                this.moveArray.shift();
            }
        }

    };

    this.moveEnd = function () {
        this.moveArray.shift();
        var length = this.moveArray.length,
            moveResult = 0, // moveResult 指的是出来 如何移动 //    0 代表停下   1 代表继续往前行走   2 代表走第二个  3 代表继续往前行走 但是第二个还在数组当中
            nextMoveType = this.moveArray[0];

        if (GameTool.getIslegalForTile(this.position)) {
            if (length == 0) {
                if (this.getCanMoveOn(this.moveType)) {
                    moveResult = 1;
                }
                else {
                    moveResult = 0;
                }
            }
            else if (length == 1) {
                if (this.getCanMoveOn(nextMoveType)) {
                    moveResult = 2;
                }
                else {
                    moveResult = 3;
                }
            }
        }
        else {
            if (length == 1) {
                if (this.getRelationBy(nextMoveType, this.moveType) == 1) {
                    moveResult = 2;
                }
                else {
                    moveResult = 3;
                }
            }
            else {
                moveResult = 1;
            }
        }

        // moveResult 指的是出来 如何移动 //    0 代表停下   1 代表继续往前行走   2 代表走第二个  3 代表继续往前行走 但是第二个还在数组当中
        if (moveResult == 0) {
            this.moveType = -1;
        }
        if (moveResult == 1) {
            this.moveArray.push(this.moveType);
            this.moveActionByType(this.moveType);
        }
        else if (moveResult == 2) {
            if (this.getCanMoveOn(nextMoveType)) {
                this.moveActionByType(nextMoveType);
            }
            else {
                this.moveType = -1;
                this.moveArray.shift();
            }

        } else if (moveResult == 3) {
            if (this.getCanMoveOn(this.moveType)) {
                this.moveArray.unshift(this.moveType);
                this.moveActionByType(this.moveType);

            }
            else {
                this.moveType = -1;
                this.moveArray.shift();
            }
        }

        this.updateCurrTileProperty();

    };


    this.getCanMoveOn = function (moveType) {

        var tileProperty = this.terminalProperties, canMove = false;

        if (tileProperty == 15) {
            return true;
        } else if (tileProperty == 14) {
            return false;
        }

        switch (moveType) {
            case 0:
                if (tileProperty == 0 || tileProperty == 1 || tileProperty == 3 || tileProperty == 4 || tileProperty == 7 || tileProperty == 9 || tileProperty == 11) {
                    canMove = true;
                }
                break;
            case 1:
                if (tileProperty == 1 || tileProperty == 2 || tileProperty == 3 || tileProperty == 5 || tileProperty == 6 || tileProperty == 9 || tileProperty == 13) {
                    canMove = true;
                }
                break;
            case 2:
                if (tileProperty == 0 || tileProperty == 2 || tileProperty == 3 || tileProperty == 6 || tileProperty == 7 || tileProperty == 8 || tileProperty == 10) {
                    canMove = true;
                }
                break;
            case 3:
                if (tileProperty == 0 || tileProperty == 1 || tileProperty == 2 || tileProperty == 4 || tileProperty == 5 || tileProperty == 8 || tileProperty == 12) {
                    canMove = true;
                }
                break;
            default:
                break;
        }

        return canMove;
    };

    // 0 为 相同方向  1 为相反方向   2 为 垂直方向
    this.getRelationBy = function (direction1, direction2) {

        if (direction2 == -1) {
            return 2;
        }


        var type = 0;
        switch (direction1) {
            case 0:
                switch (direction2) {
                    case 0:
                        type = 0;
                        break;
                    case 1:
                        type = 1;
                        break;
                    case 2:
                    case 3:
                        type = 2;
                        break;
                }
                break;
            case 1:
                switch (direction2) {
                    case 0:
                        type = 1;
                        break;
                    case 1:
                        type = 0;
                        break;
                    case 2:
                    case 3:
                        type = 2;
                        break;
                }
                break;
            case 2:
                switch (direction2) {
                    case 0:
                    case 1:
                        type = 2;
                        break;
                    case 2:
                        type = 0;
                        break;
                    case 3:
                        type = 1;
                        break;
                }
                break;
            case 3:
                switch (direction2) {
                    case 0:
                    case 1:
                        type = 2;
                        break;
                    case 2:
                        type = 1;
                        break;
                    case 3:
                        type = 0;
                        break;
                }
                break;
            default:
                break;
        }

        return type;
    }

};