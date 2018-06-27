/**
 * 查看比赛时参加比赛
 */
import Parse from 'parse';

import { updateGPs } from '../parse/gamePlayer';
import { insertGameDownsLog } from '../parse/log'
import { setPlayersBalance } from '../parse/player'
import { setGameStatus, STATUS_GAMING, STATUS_FINISHED } from '../parse/game'

export const SET_GAME_DOWN = "SET_GAME_DOWN"

export const SAVE = "SAVE_DOWN"
export const SAVE_FAILED = "SAVE_DOWN_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_DOWN_SUCCESSFUL"

export const FETCH_RAKEOFFS = "FETCH_RAKEOFFS"
export const FETCH_RAKEOFFS_FAILED = "FETCH_RAKEOFFS_FAILED"
export const FETCH_RAKEOFFS_SUCCESSFUL = "FETCH_RAKEOFFS_SUCCESSFUL"


export const SET_FINAL_CHIPS = "SET_FINAL_CHIPS"

export const CLEAR = "CLEAR_GAMEDOWNS"


/**
 * 手动输入最终筹码后 通过redux更新界面
 * @param {*} gamePlayer 
 * @param {*} finalChips 
 */
export const setFinalChips = (gamePlayer, finalChips) => {
    return dispatch => {
        let chips = gamePlayer.get('chips');
        let rakeoff = gamePlayer.get('player').get('rakeoff');
        let winChips = finalChips - chips;
        let shuiChips = 0;
        if (winChips >= 0) {
            //赢了 抽玩家水
            shuiChips = parseInt(winChips * rakeoff.get('win') / 100, 10);
        } else {
            //输了 返给玩家
            shuiChips = parseInt(winChips * rakeoff.get('lose') / 100, 10);
        }

        gamePlayer.set('finalChips', finalChips);
        gamePlayer.set('winChips', winChips);
        gamePlayer.set('shuiChips', shuiChips);

        dispatch({ type: SET_FINAL_CHIPS, gamePlayer });
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
 * 设置要参加的比赛
 * @param {Parse.Object.extend("Req")} game 
 */
export const setGameDown = (game, gamePlayers) => {
    return dispatch => {
        dispatch({ type: SET_GAME_DOWN, game, gamePlayers });
    }
}



/**
 * 
 * @param {*} gamePlayers 
 */
export const save = (gamePlayers, game) => {
    return dispatch => {
        // 1保存gameplayers
        // 2把比赛相关的玩家的余额设置为扣除水钱的所有chips
        // 3生成每个玩家的downlog
        // 4生成水log
        // 设置game的状态为GAME_FINISHED
        dispatch({ type: SAVE });
        let gPlayers = [];
        updateGPs(gamePlayers)
            .then(function (gps) {
                console.log(`action:gameDowns:saveGamePlayers:${gps.length}`)
                return setPlayersBalance(gps);
            }).then(function (players) {
                gPlayers = [...players];
                console.log(`action:gameDowns:setPlayersBalance:${players.length}`)
                return insertGameDownsLog(gamePlayers);
            }).then(function (logs) {
                console.log(`action:gameDowns:insertGameDownsLog:${logs.length}`)
                return setGameStatus(game, STATUS_FINISHED)
            }).then(function (game) {
                console.log(`action:gameDowns:setGameStatus:${game}`)
                dispatch({ type: SAVE_SUCCESSFUL, gPlayers });
            }, function (error) {
                dispatch({ type: SAVE_FAILED, error });
            });


    }
}


/**
 * 获取回水方案 
 */
export const fetchRakeoffs = () => {
    return dispatch => {
        dispatch({ type: FETCH_RAKEOFFS });
        let Rakeoff = Parse.Object.extend("Rakeoff");
        let query = new Parse.Query(Rakeoff);
        query.descending('_created_at');
        query.find()
            .then(function (results) {
                dispatch({ type: FETCH_RAKEOFFS_SUCCESSFUL, rakeoffs: results });
            }, function (error) {
                dispatch({ type: FETCH_RAKEOFFS_FAILED, error });
            });

    }
}


