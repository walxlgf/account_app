import Parse from 'parse';

export const SAVE = "SAVE_GAME_PLAYER"
export const SAVE_FAILED = "SAVE_GAME_PLAYER_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_GAME_PLAYER_SUCCESSFUL"

export const FETCH_GAME_PLAYERS = "FETCHS_GAME_PLAYERS"
export const FETCH_GAME_PLAYERS_FAILED = "FETCH_GAME_PLAYERS_FAILED"
export const FETCH_GAME_PLAYERS_SUCCESSFUL = "FETCH_GAME_PLAYERS_SUCCESSFUL"


export const CLEAR = "CLEAR_GAMEPLAYER"


/**
 * 分页查询
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
    }
}

/**
 * 分页查询
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export const fetchGamePlayers = (startIndex, pageSize) => {
    return dispatch => {
        dispatch({ type: FETCH_GAME_PLAYERS });
        let GamePlayer = Parse.Object.extend("GamePlayer");
        let query = new Parse.Query(GamePlayer);
        query.descending('_created_at');
        query.include('game');
        query.include('player');
        query.skip(startIndex);
        query.limit(pageSize);
        query.find()
            .then(function (results) {
                let hasmore = true;
                if (results.length < pageSize)
                    hasmore = false;
                dispatch({ type: FETCH_GAME_PLAYERS_SUCCESSFUL, gamePlayers: results, hasmore });
            }, function (error) {
                dispatch({ type: FETCH_GAME_PLAYERS_FAILED, error });
            });

    }
}


/**
 * 新建时保存
 * @param {object} gamePlayerData 
 */
export const save = (gamePlayerData) => {
    return dispatch => {
        let GamePlayer = Parse.Object.extend("GamePlayer");
        let gamePlayer = new GamePlayer();
        gamePlayer.set('game', gamePlayerData.game);
        gamePlayer.set('player', gamePlayerData.player);
        dispatch({ type: SAVE, gamePlayer });
        gamePlayer.save()
            .then(function (gamePlayer) {
                dispatch({ type: SAVE_SUCCESSFUL, gamePlayer });
            }, function (error) {
                console.log(`action:gamePlayer:save:error:${JSON.stringify(error)}`)
                dispatch({ type: SAVE_FAILED, gamePlayer, error });
            });
    }
}


