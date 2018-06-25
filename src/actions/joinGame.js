import Parse from 'parse';


export const FETCH_GAMES = "FETCHS_GAMES"
export const FETCH_GAMES_FAILED = "FETCH_GAMES_FAILED"
export const FETCH_GAMES_SUCCESSFUL = "FETCH_GAMES_SUCCESSFUL"

export const FETCH_PLAYERS = "FETCHS_PLAYERS"
export const FETCH_PLAYERS_FAILED = "FETCH_PLAYERS_FAILED"
export const FETCH_PLAYERS_SUCCESSFUL = "FETCH_PLAYERS_SUCCESSFUL"

export const SAVE = "SAVE_JOIN_GAME"
export const SAVE_FAILED = "SAVE_JOIN_GAME_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_JOIN_GAME_SUCCESSFUL"

export const CLEAR = "CLEAR_JONIN_GAME_INNER"


/**
 * 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
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
 * 分页查询
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export const fetchGames = () => {
    return dispatch => {
        dispatch({ type: FETCH_GAMES });
        let Game = Parse.Object.extend("Game");
        let query = new Parse.Query(Game);
        query.descending('_created_at');
        query.find()
            .then(function (results) {
                dispatch({ type: FETCH_GAMES_SUCCESSFUL, games: results });
            }, function (error) {
                dispatch({ type: FETCH_GAMES_FAILED, error });
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
        gamePlayer.set('chips', 0);
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




