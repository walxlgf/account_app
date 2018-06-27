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
        //保存sons
        //获取到保存后的sons赋值给player.sons属性
        //更sons中每一个son的player

        dispatch({ type: SAVE });
        let Son = Parse.Object.extend("Son");
        let sonsData = [];
        data.sons.map((s) => {
            let son = new Son();
            son.set('name', s.name);
            sonsData.push(son);
        })

        let gSons = [];
        let gPlayer;
        //
        Parse.Object.saveAll(sonsData)
            .then(function (sons) {
                console.log(`action:addPlayer:save:saveAll(sons):${sons && sons.length}`)
                gSons = [...sons];
                let Player = Parse.Object.extend("Player");
                let player = new Player();
                player.set('name', data.name);
                player.set('rakeoff', data.rakeoff);
                player.set('sons', sons);
                player.set('balance', 0);
                player.set('user', Parse.User.current());
                return player.save()
            }).then(function (player) {
                gPlayer = player;
                console.log(`action:addPlayer:save:save():${player && player.get('name')}`)
                gSons.map((son, index) => {
                    son.set('player', player);
                })
                return Parse.Object.saveAll(gSons)
            }).then(function (sons) {
                dispatch({ type: SAVE_SUCCESSFUL, gPlayer });
                console.log(`action:addPlayer:save:saveAll(sonsArr):${sons && sons.length}`)
            }, function (error) {
                dispatch({ type: SAVE_FAILED, error });
            });

        // let Player = Parse.Object.extend("Player");
        // let player = new Player();
        // player.set('name', data.name);
        // player.set('rakeoff', data.rakeoff);
        // player.set('balance', 0);
        // player.set('user', Parse.User.current());
        // player.save()
        //     .then(function (player) {
        //         dispatch({ type: SAVE_SUCCESSFUL, player });
        //     }, function (error) {
        //         console.log(`action:player:save:error:${JSON.stringify(error)}`)
        //         dispatch({ type: SAVE_FAILED, player, error });
        //     });
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


