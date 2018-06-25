/**
 * 查看比赛时参加比赛
 */
import Parse from 'parse';

import { insertGPs } from '../parse/gamePlayer'

export const SET_GAME = "SET_GAME"

export const FETCH_PLAYERS = "FETCHS_PLAYERS"
export const FETCH_PLAYERS_FAILED = "FETCH_PLAYERS_FAILED"
export const FETCH_PLAYERS_SUCCESSFUL = "FETCH_PLAYERS_SUCCESSFUL"

export const SAVE = "SAVE_JOIN_GAME_INNER"
export const SAVE_FAILED = "SAVE_JOIN_GAME_INNER_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_JOIN_GAME_INNER_SUCCESSFUL"



export const CLEAR = "CLEAR_JOIN_GAME_INNER"


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
export const setJoinGame = (game) => {
    return dispatch => {
        dispatch({ type: SET_GAME, game });
    }
}


/**
 * 获取所有玩家
 */
export const fetchPlayers = () => {
    return dispatch => {
        dispatch({ type: FETCH_PLAYERS });
        let Player = Parse.Object.extend("Player");
        let query = new Parse.Query(Player);
        query.descending('_created_at');
        query.find()
            .then(function (results) {
                dispatch({ type: FETCH_PLAYERS_SUCCESSFUL, players: results });
            }, function (error) {
                dispatch({ type: FETCH_PLAYERS_FAILED, error });
            });

    }
}

/**
 * 新建时保存
 * @param {object} gamePlayerData 
 */
export const save = (players, game) => {
    return dispatch => {
        dispatch({ type: SAVE });

        insertGPs(game, players)
            .then(function (gamePlayers) {
                console.log(`action:joinGamePlayer:gamePlayers:${gamePlayers.length}`)
                dispatch({ type: SAVE_SUCCESSFUL, gamePlayers });
            }, function (error) {
                dispatch({ type: SAVE_FAILED, error });
            });
    }
}


