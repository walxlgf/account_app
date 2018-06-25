import Parse from 'parse';


export const FETCH = "FETCH"
export const FETCH_FAILED = "FETCH_FAILED"
export const FETCH_SUCCESSFUL = "FETCH_SUCCESSFUL"


export const CLEAR = "CLEAR_RAKEOFFS"
/**
 * 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
    }
}

/**
 * 获取回水方案 
 */
export const fetchRakeoffs = () => {
    return dispatch => {
        dispatch({ type: FETCH });
        let Rakeoff = Parse.Object.extend("Rakeoff");
        let query = new Parse.Query(Rakeoff);
        query.descending('_created_at');
        query.find()
            .then(function (results) {
                dispatch({ type: FETCH_SUCCESSFUL, rakeoffs: results });
            }, function (error) {
                dispatch({ type: FETCH_FAILED, error });
            });

    }
}



