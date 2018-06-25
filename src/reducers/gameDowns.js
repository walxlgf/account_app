
import {
    SET_GAME_DOWN,
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
    FETCH_RAKEOFFS, FETCH_RAKEOFFS_FAILED, FETCH_RAKEOFFS_SUCCESSFUL,
    SET_FINAL_CHIPS,
    CLEAR,
} from '../actions/gameDowns'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //保存 包括新增和更新
    game: null,
    saving: false,//正在保存
    saved: false,//保存是否成功
    gamePlayers: [],

    fetching: false,//正在查询
    rakeoffs: [],

    gamePlayer: null,//用于setFinalChips

    error: null,
};

export function gameDowns(state = initialState, action) {
    switch (action.type) {
        case SET_GAME_DOWN:
            return {
                ...state,
                game: action.game,
                gamePlayers: action.gamePlayers,
            }


        case SET_FINAL_CHIPS:
            let gamePlayers = [...state.gamePlayers];
            //获取被删除gamePlayer的索引
            let index = gamePlayers.findIndex(function (value, index, arr) {
                return value.id === action.gamePlayer.id;
            });
            console.log(`reducer:gameDowns:SGAMEPLAYERS_DELETED:index:${index} 1`);
            if (index != -1) {
                //替换
                gamePlayers.splice(index, 1, action.gamePlayer);
                console.log(`reducer:gameDowns:SGAMEPLAYERS_DELETED:splice 2`);
            }
            //重新赋值 不然虽然gamePlayers数组虽然已经删除了一个元素 但引用地址没有变 不会触发componentWillReceiveProps
            return {
                ...state,
                gamePlayers: [...gamePlayers],
            }

        case SAVE:
            return {
                ...state,
                saving: true,
                saved: false,
                error: null
            }
        case SAVE_FAILED:
            return {
                ...state,
                saving: false,
                saved: false,
                error: action.error,
            };
        case SAVE_SUCCESSFUL:
            return {
                ...state,
                saving: false,
                saved: true,
                gamePlayers: action.gamePlayers,
                error: null,
            };

        case FETCH_RAKEOFFS:
            return {
                ...state,
                fetching: true,
                rakeoffs: [],
                error: null
            }
        case FETCH_RAKEOFFS_FAILED:
            return {
                ...state,
                fetching: false,
                rakeoffs: [],
                error: action.error
            };
        case FETCH_RAKEOFFS_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                rakeoffs: action.rakeoffs,
                error: null,
            };
        case CLEAR_STATE:
            return {
                ...initialState
            };
        case CLEAR:
            console.log(`reducer:gameDowns:CLEAR`);
            return {
                ...initialState
            };
        default:
            return state;
    }
}