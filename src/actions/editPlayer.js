import Parse from 'parse';

export const SET = "SET_PLAYER"

export const SAVE = "SAVE_PLAYER"
export const SAVE_FAILED = "SAVE_PLAYER_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_PLAYER_SUCCESSFUL"

export const FETCH_RAKEOFFS = "FETCH_RAKEOFFS"
export const FETCH_RAKEOFFS_FAILED = "FETCH_RAKEOFFS_FAILED"
export const FETCH_RAKEOFFS_SUCCESSFUL = "FETCH_RAKEOFFS_SUCCESSFUL"




export const GET = "GET_PLAYER"
export const GET_FAILED = "GET_PLAYER_FAILED"
export const GET_SUCCESSFUL = "GET_PLAYER_SUCCESSFUL"

export const CLEAR = "CLEAR_EDIT_PLAYER"

/**
 * 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
    }
}

/**
 * 
 */
export const setPlayer = (player) => {
    return dispatch => {
        dispatch({ type: SET, player });
    }
}


/**
 * 
 * @param {Parse.Object.extend("Player")} player 
 */
export const save = (player) => {
    return dispatch => {
        //保存sons
        //获取到保存后的sons赋值给player.sons属性 保存player
        dispatch({ type: SAVE });
        Parse.Object.saveAll(player.get('sons'))
            .then(function (sons) {
                console.log(`action:editPlayer:save:saveAll(sons):${sons && sons.length}`)
                player.set('sons', sons);
                return player.save()
            }).then(function (player) {
                console.log(`action:addPlayer:save:save():${player && player.get('name')}`)
                dispatch({ type: SAVE_SUCCESSFUL, player });
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


/**
 * 获取回水方案 
 */
export const getPlayer = (player) => {
    return dispatch => {
        dispatch({ type: GET });
        let Player = Parse.Object.extend("Player");
        let query = new Parse.Query(Player);
        query.include('sons');
        query.get(player.id)
            .then(function (player) {
                dispatch({ type: GET_SUCCESSFUL, player });
            }, function (error) {
                dispatch({ type: GET_FAILED, error });
            });

    }
}


