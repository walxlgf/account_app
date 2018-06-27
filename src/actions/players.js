import Parse from 'parse';
import { TYPE_DEPOSIT, TYPE_WITHDRAW, insertLog } from '../parse/log';
import { setPlayerBalance } from '../parse/player';

export const FETCH = "FETCHS_PLAYERS"
export const FETCH_FAILED = "FETCHS_PLAYERS_FAILED"
export const FETCH_SUCCESSFUL = "FETCHS_PLAYERS_SUCCESSFUL"

export const CLEAR = "CLEAR_PALYERS"



export const SPLAYERS_CREATED = "SPLAYERS_CREATED"
export const SPLAYERS_DELETED = "SPLAYERS_DELETED"
export const SPLAYERS_UPDATED = "SPLAYERS_UPDATED"


//监听games列表
let splayers;
export const subscribePlayers = () => {
    return dispatch => {
        let Player = Parse.Object.extend("Player");
        let query = new Parse.Query(Player);
        splayers = query.subscribe();
        splayers.on('open', () => {
            console.log(`action:player:splayers:opened:`);
        });
        splayers.on('create', (player) => {
            console.log(`action:player:splayers created:${JSON.stringify(player)}`);
            dispatch({ type: SPLAYERS_CREATED, player: player });
        });

        splayers.on('update', (player) => {
            console.log(`action:player:splayers  updated1:${JSON.stringify(player.get('title'))}`);
            dispatch({ type: SPLAYERS_UPDATED, player });
        });
        splayers.on('delete', (player) => {
            console.log(`action:player:splayers:deleted:${player}`);
            dispatch({ type: SPLAYERS_DELETED, player: player });
        });

        splayers.on('close', () => {
            console.log('action:player:splayers:closed');
        });
    }
}


export const unsubscribePlayers = () => {
    return dispatch => {
        if (splayers) {
            splayers.unsubscribe();
        }
    }
}

/**
 * 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
    }
}



/**
 * 分页查询
 */
export const fetchPlayers = () => {
    return dispatch => {
        dispatch({ type: FETCH });
        let Player = Parse.Object.extend("Player");
        let query = new Parse.Query(Player);
        query.descending('_created_at');
        query.include('rakeoff');
        query.find()
            .then(function (results) {
                dispatch({ type: FETCH_SUCCESSFUL, players: results });
            }, function (error) {
                dispatch({ type: FETCH_FAILED, error });
            });

    }
}


/**
 * 充值
 * @param {} player  player
 * @param {} amount 金额 
 */
export const deposit = (player,  amount) => {
    return dispatch => {
        console.log(`action:editPlayer:deposit:0:amount:${amount}`)
        // 1 player balance 添加 
        // 2 Log添加一条TYPE_DEPOSIT记录
        setPlayerBalance(player, amount, TYPE_DEPOSIT)
            .then(function (player) {
                console.log(`action:editPlayer:deposit:setPlayerBalance:1`)
                // 3 Log添加一条deposit记录
                return insertLog(null, player, null, TYPE_DEPOSIT, amount);
            }).then(function (log) {
                console.log(`action:editPlayer:deposit:insertLog:2`)
            }, function (error) {
                console.log(`action:editPlayer:deposit:error:${error}`);
            })
    }
}

/**
 * 提现
 * @param {} player  player
 * @param {} amount 金额 
 */
export const withdraw = (player,  amount) => {
    return dispatch => {
        // 1 player balance 添加 
        // 2 Log添加一条TYPE_DEPOSIT记录
        setPlayerBalance(player, amount, TYPE_WITHDRAW)
            .then(function (gamePlayer) {
                console.log(`action:editPlayer:withdraw:setPlayerBalance:1`)
                // 3 Log添加一条withdraw记录
                return insertLog(null, player, null, TYPE_WITHDRAW, amount);
            }).then(function (log) {
                console.log(`action:editPlayer:withdraw:insertLog:2`)
            }, function (error) {
                console.log(`action:editPlayer:withdraw:error:${error}`);
            })
    }
}




