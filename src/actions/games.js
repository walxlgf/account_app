import Parse from 'parse';



export const FETCH_GAMES = "FETCHS_GAMES"
export const FETCH_GAMES_FAILED = "FETCH_GAMES_FAILED"
export const FETCH_GAMES_SUCCESSFUL = "FETCH_GAMES_SUCCESSFUL"

export const CLEAR = "CLEAR_GAMES"
/**
 * 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
    }
}

/**
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