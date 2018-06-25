import Parse from 'parse';

export const SET_CLUB = "SET_CLUB" //编辑时模板是选CLUB设置 this.state.club.club 

export const UPEATE_CLUB = "UPEATE_CLUB"
export const UPEATE_CLUB_FAILED = "UPEATE_CLUB_FAILED"
export const UPEATE_CLUB_SUCCESSFUL = "UPEATE_CLUB_SUCCESSFUL"

export const SAVE = "SAVE_CLUB"
export const SAVE_FAILED = "SAVE_CLUB_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_CLUB_SUCCESSFUL"

export const FETCH_CLUBS = "FETCHS_CLUBS"
export const FETCH_CLUBS_FAILED = "FETCH_CLUBS_FAILED"
export const FETCH_CLUBS_SUCCESSFUL = "FETCH_CLUBS_SUCCESSFUL"

export const DELETE_CLUB = "DELETE_CLUB"
export const DELETE_CLUB_FAILED = "DELETE_CLUB_FAILED"
export const DELETE_CLUB_SUCCESSFUL = "DELETE_CLUB_SUCCESSFUL"

/**
 * 编辑模板之前把CLUB设置到this.state.club.club中 
 * @param {Parse.Object.extend("Club")} club 
 */
export const setClub = (club, opt = 'add') => {
    return dispatch => {
        dispatch({ type: SET_CLUB, club, opt });
    }
}

/**
 * 删除指定Club
 * @param {Parse.Object.extend("Club")} club 
 */
export const deleteClub = (club) => {
    return dispatch => {
        dispatch({ type: DELETE_CLUB });
        club.destroy()
            .then(function (club) {
                dispatch({ type: DELETE_CLUB_SUCCESSFUL, club });
            }, function (error) {
                dispatch({ type: DELETE_CLUB_FAILED, error });
            });

    }
}
/**
 * 分页查询
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export const fetchClubs = (startIndex, pageSize) => {
    return dispatch => {
        dispatch({ type: FETCH_CLUBS });
        let Club = Parse.Object.extend("Club");
        let query = new Parse.Query(Club);
        query.descending('_created_at');
        query.skip(startIndex);
        query.limit(pageSize);
        query.find()
            .then(function (results) {
                let hasmore = true;
                if (results.length < pageSize)
                    hasmore = false;
                dispatch({ type: FETCH_CLUBS_SUCCESSFUL, clubs: results, hasmore });
            }, function (error) {
                dispatch({ type: FETCH_CLUBS_FAILED, error });
            });

    }
}

/**
 * 新建时保存
 * @param {object} clubData 
 */
export const save = (clubData) => {
    return dispatch => {
        let Club = Parse.Object.extend("Club");
        let club = new Club();
        club.set('title', clubData.title);
        club.set('user',Parse.User.current());
        dispatch({ type: SAVE, club });
        club.save()
            .then(function (club) {
                dispatch({ type: SAVE_SUCCESSFUL, club });
            }, function (error) {
                console.log(`action:club:save:error:${JSON.stringify(error)}`)
                dispatch({ type: SAVE_FAILED, club, error });
            });
    }
}

/**
 * 新建时保存
 * @param {Parse.Object.extend("Club")} club 
 */
export const updateClub = (club) => {
    return dispatch => {
        dispatch({ type: UPEATE_CLUB, club });
        club.save()
            .then(function (club) {
                dispatch({ type: UPEATE_CLUB_SUCCESSFUL, club });
            }, function (error) {
                console.log(`action:club:save:error:${JSON.stringify(error)}`)
                dispatch({ type: UPEATE_CLUB_FAILED, club, error });
            });
    }
}

