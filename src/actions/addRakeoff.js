import Parse from 'parse';

export const CLEAR = "CLEAR_ADD_RAKEOFF"

export const SAVE = "SAVE_RAKEOFF"
export const SAVE_FAILED = "SAVE_RAKEOFF_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_RAKEOFF_SUCCESSFUL"

/**
 * 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
    }
}

/**
 * 保存
 * @param {object} data 
 */
export const save = (data) => {
    return dispatch => {
        dispatch({ type: SAVE });
        let Rakeoff = Parse.Object.extend("Rakeoff");
        let rakeoff = new Rakeoff();
        rakeoff.set('name', data.name);
        rakeoff.set('rakeoff', data.rakeoff);
        rakeoff.set('user', Parse.User.current());
        rakeoff.save()
            .then(function (rakeoff) {
                dispatch({ type: SAVE_SUCCESSFUL, rakeoff });
            }, function (error) {
                console.log(`action:rakeoff:save:error:${JSON.stringify(error)}`)
                dispatch({ type: SAVE_FAILED, rakeoff, error });
            });
    }
}


