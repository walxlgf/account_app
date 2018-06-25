import Parse from 'parse';

export const SET_REQ = "SET_REQ"

export const SAVE = "SAVE_REQ"
export const SAVE_FAILED = "SAVE_REQ_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_REQ_SUCCESSFUL"

export const FETCH_REQS = "FETCHS_REQS"
export const FETCH_REQS_FAILED = "FETCH_REQS_FAILED"
export const FETCH_REQS_SUCCESSFUL = "FETCH_REQS_SUCCESSFUL"

export const FETCH_BY_USER = "FETCHS_BY_USER"
export const FETCH_BY_USER_FAILED = "FETCH_BY_USER_FAILED"
export const FETCH_BY_USER_SUCCESSFUL = "FETCH_BY_USER_SUCCESSFUL"

export const DELETE_REQ = "DELETE_REQ"
export const DELETE_REQ_FAILED = "DELETE_REQ_FAILED"
export const DELETE_REQ_SUCCESSFUL = "DELETE_REQ_SUCCESSFUL"


export const FETCH_GAMES = "FETCHS_GAMES"
export const FETCH_GAMES_FAILED = "FETCH_GAMES_FAILED"
export const FETCH_GAMES_SUCCESSFUL = "FETCH_GAMES_SUCCESSFUL"



export const FETCH_PLAYERS = "FETCHS_PLAYERS"
export const FETCH_PLAYERS_FAILED = "FETCHS_PLAYERS_FAILED"
export const FETCH_PLAYERS_SUCCESSFUL = "FETCHS_PLAYERS_SUCCESSFUL"

//LiveQuery
export const SREQS_DELETED = "SREQS_DELETED";//监听到删除
export const SREQS_CREATED = "SREQS_CREATED";//监听到更新


//监听games列表
let sreqs;
export const subscribeReqs = () => {
    return dispatch => {
        let Req = Parse.Object.extend("Req");
        let query = new Parse.Query(Req);
        sreqs = query.subscribe();
        sreqs.on('open', () => {
            console.log(`req:sreqs:opened:`);
        });
        sreqs.on('create', (req) => {
            console.log(`req:sreqs created:${JSON.stringify(req)}`);
            dispatch({ type: SREQS_CREATED, req: req });
        });
        sreqs.on('delete', (req) => {
            console.log(`req:sreqs:deleted:${req}`);
            dispatch({ type: SREQS_DELETED, req: req });
        });

        sreqs.on('close', () => {
            console.log('req:sreqs:closed');
        });
    }
}


export const unsubscribeReqs = () => {
    return dispatch => {
        if (sreqs) {
            sreqs.unsubscribe();
        }
    }
}


/**
 * 分页查询
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export const fetchPlayers = () => {
    return dispatch => {
        dispatch({ type: FETCH_PLAYERS });
        let Player = Parse.Object.extend("Player");
        let query = new Parse.Query(Player);
        query.descending('_created_at');
        query.include('rakeoff');
        query.find()
            .then(function (results) {
                dispatch({ type: FETCH_PLAYERS_SUCCESSFUL, players: results });
            }, function (error) {
                dispatch({ type: FETCH_PLAYERS_FAILED, error });
            });

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

/**
 * 编辑模板之前把REQ设置到this.state.req.req中 
 * @param {Parse.Object.extend("Req")} req 
 */
export const setReq = (req, opt) => {
    return dispatch => {
        dispatch({ type: SET_REQ, req, opt });
    }
}

/**
 * 删除指定Req
 * @param {Parse.Object.extend("Req")} req 
 */
export const deleteReq = (req) => {
    return dispatch => {
        dispatch({ type: DELETE_REQ });
        req.destroy()
            .then(function (req) {
                dispatch({ type: DELETE_REQ_SUCCESSFUL, req });
            }, function (error) {
                dispatch({ type: DELETE_REQ_FAILED, error });
            });
    }
}


/**
 * 分页查询
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export const fetchReqs = () => {
    return dispatch => {
        dispatch({ type: FETCH_REQS });
        let Req = Parse.Object.extend("Req");
        let query = new Parse.Query(Req);
        query.descending('_created_at');
        query.include('game');
        query.include('player');
        query.find()
            .then(function (results) {
                dispatch({ type: FETCH_REQS_SUCCESSFUL, reqs: results });
            }, function (error) {
                dispatch({ type: FETCH_REQS_FAILED, error });
            });

    }
}



/**
 * 新建时保存
 * @param {object} reqData 
 */
export const save = (reqData) => {
    return dispatch => {
        let Req = Parse.Object.extend("Req");
        let req = new Req();
        req.set('game', reqData.game);
        req.set('player', reqData.player);
        req.set('type', reqData.type);
        req.set('amount', reqData.amount);
        dispatch({ type: SAVE, req });
        req.save()
            .then(function (req) {
                dispatch({ type: SAVE_SUCCESSFUL, req });
            }, function (error) {
                console.log(`action:req:save:error:${JSON.stringify(error)}`)
                dispatch({ type: SAVE_FAILED, req, error });
            });
    }
}


