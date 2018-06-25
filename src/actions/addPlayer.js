import Parse from 'parse';


export const CLEAR = "CLEAR_ADD_PLAYER"
export const SAVE = "SAVE_PLAYER"
export const SAVE_FAILED = "SAVE_PLAYER_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_PLAYER_SUCCESSFUL"

export const FETCH_RAKEOFFS = "FETCH_RAKEOFFS"
export const FETCH_RAKEOFFS_FAILED = "FETCH_RAKEOFFS_FAILED"
export const FETCH_RAKEOFFS_SUCCESSFUL = "FETCH_RAKEOFFS_SUCCESSFUL"


/**
 * 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
    }
}
/**
 * 新建时保存
 * @param {object} data 
 */
export const save = (data) => {
    return dispatch => {
        let Player = Parse.Object.extend("Player");
        let player = new Player();
        player.set('name', data.name);
        player.set('startTime', data.startTime);
        player.set('duration', data.duration);
        player.set('user', Parse.User.current());
        dispatch({ type: SAVE });
        player.save()
            .then(function (player) {
                dispatch({ type: SAVE_SUCCESSFUL, player });
            }, function (error) {
                console.log(`action:player:save:error:${JSON.stringify(error)}`)
                dispatch({ type: SAVE_FAILED, player, error });
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


