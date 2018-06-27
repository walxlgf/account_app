import Parse from 'parse';
import { TYPE_UP, TYPE_DOWN, TYPE_DEPOSIT, TYPE_WITHDRAW } from '../parse/log'
import { insertLog } from '../parse/log'
import { setPlayerBalance } from '../parse/player'
import { setGPChips, getGP } from '../parse/gamePlayer'
import { gamePlayer } from '../reducers/gamePlayer';

export const SET_GAME = "SET_GAME"

export const CLEAR = "CLEAR_VIEW_GAME";//退出界面时把state内容初始化

export const FETCH_GAME_PLAYERS = "FETCHS_GAME_PLAYERS"
export const FETCH_GAME_PLAYERS_FAILED = "FETCH_GAME_PLAYERS_FAILED"
export const FETCH_GAME_PLAYERS_SUCCESSFUL = "FETCH_GAME_PLAYERS_SUCCESSFUL"


export const SGAMEPLAYERS_CREATED = "SGAMEPLAYERS_CREATED"
export const SGAMEPLAYERS_DELETED = "SGAMEPLAYERS_DELETED"
export const SGAMEPLAYERS_UPDATED = "SGAMEPLAYERS_UPDATED"


//监听games列表
let sgamePlayers;
export const subscribeGamePlayers = (game) => {
    return dispatch => {
        let GamePlayer = Parse.Object.extend("GamePlayer");
        let query = new Parse.Query(GamePlayer);
        query.equalTo('game', game)
        sgamePlayers = query.subscribe();
        sgamePlayers.on('open', () => {
            console.log(`gamePlayer:sgamePlayers:opened:`);
        });
        sgamePlayers.on('create', (gamePlayer) => {
            console.log(`gamePlayer:sgamePlayers created:${JSON.stringify(gamePlayer)}`);
            dispatch({ type: SGAMEPLAYERS_CREATED, gamePlayer: gamePlayer });
        });

        sgamePlayers.on('update', (gamePlayer) => {
            let game = gamePlayer.get('game');
            console.log(`game:sgame updated1:${JSON.stringify(game.get('title'))}`);
            dispatch({ type: SGAMEPLAYERS_UPDATED, gamePlayer });
        });
        sgamePlayers.on('delete', (gamePlayer) => {
            console.log(`gamePlayer:sgamePlayers:deleted:${gamePlayer}`);
            dispatch({ type: SGAMEPLAYERS_DELETED, gamePlayer: gamePlayer });
        });

        sgamePlayers.on('close', () => {
            console.log('gamePlayer:sgamePlayers:closed');
        });
    }
}


export const unsubscribeGamePlayers = () => {
    return dispatch => {
        if (sgamePlayers) {
            sgamePlayers.unsubscribe();
        }
    }
}



/**
 * 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
    }
}

/**
 * 查看game之前 先把要查看的game设置在state中保存
 * @param {Parse.Object.extend("Req")} game 
 */
export const setGame = (game) => {
    return dispatch => {
        dispatch({ type: SET_GAME, game });
    }
}

/**
 * 分页查询
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export const fetchGamePlayers = (game) => {
    return dispatch => {
        console.log(`actions:viewGame:fetchGamePlayers:game:${game.get('name')}`);
        dispatch({ type: FETCH_GAME_PLAYERS });
        let GamePlayer = Parse.Object.extend("GamePlayer");
        let query = new Parse.Query(GamePlayer);
        query.descending('_created_at');
        query.equalTo('game', game);
        query.include('player');
        query.include('son');
        query.find()
            .then(function (results) {
                dispatch({ type: FETCH_GAME_PLAYERS_SUCCESSFUL, gamePlayers: results });
            }, function (error) {
                dispatch({ type: FETCH_GAME_PLAYERS_FAILED, error });
            });

    }
}






/**
 * 上分
 * @param {} gamePlayer  gamePlayer
 * @param {} amount 金额 
 */
export const up = (gamePlayer, amount) => {
    return dispatch => {
        let game = gamePlayer.get('game');
        let player = gamePlayer.get('player');
        let son = gamePlayer.get('son');
        // 1 gameplayer 对象的chips增加 
        // 2 player balance 减少 
        // 3 Log添加一条up记录
        console.log(`action:viewGame:up:0:game:${game.get('name')} player:${player.get('name')}`)
        setGPChips(gamePlayer, amount, TYPE_UP).then(function (gamePlayer) {
            console.log(`action:viewGame:up:setGPChips:1`)
            // 2 player balance 减少 
            return setPlayerBalance(player, amount, TYPE_UP);
        }).then(function (gamePlayer) {
            console.log(`action:viewGame:up:insertLog:2`)
            // 3 Log添加一条up记录
            return insertLog(game, player,son, TYPE_UP, amount);
        }, function (error) {
            console.log(`action:viewGame:up:error:${error}`);
        })
        console.log(`action:viewGame:up:insertLog:3`)
    }
}






