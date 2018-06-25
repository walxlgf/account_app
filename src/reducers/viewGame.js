
import {
    SET_GAME,
    FETCH_GAME_PLAYERS, FETCH_GAME_PLAYERS_FAILED, FETCH_GAME_PLAYERS_SUCCESSFUL,
    SGAMEPLAYERS_CREATED, SGAMEPLAYERS_UPDATED, SGAMEPLAYERS_DELETED,
    CLEAR,
} from '../actions/viewGame'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    game:null,
    fetching: false,//正在查询
    gamePlayers: [],
    error: null,
};

export function viewGame(state = initialState, action) {
    switch (action.type) {
        case SGAMEPLAYERS_CREATED: {
            let index = state.gamePlayers.findIndex(function (value, index, arr) {
                return value.id === action.gamePlayer.id;
            });
            //如果没有 说明还没有添加 添加进来
            if (index == -1) {
                state.gamePlayers = [action.gamePlayer, ...state.gamePlayers];
            }
            return {
                ...state,
            };
        }
        
        case SGAMEPLAYERS_UPDATED: { 
            let gamePlayers = [...state.gamePlayers];
            let index = gamePlayers.findIndex(function (value, index, arr) {
                return value.id === action.gamePlayer.id;
            });
            if (index != -1) {
                gamePlayers.splice(index, 1, action.gamePlayer);
            }
            return {
                ...state,
                //复制一份games 不然Listview.Datasource 不会触发更新 
                gamePlayers: [...gamePlayers],
            }
        }
        case SGAMEPLAYERS_DELETED: {
            let gamePlayers = [...state.gamePlayers];
            //获取被删除gamePlayer的索引
            let index = gamePlayers.findIndex(function (value, index, arr) {
                return value.id === action.gamePlayer.id;
            });
            console.log(`reducer:viewGame:SGAMEPLAYERS_DELETED:index:${index} 1`);
            if (index != -1) {
                //从state.gamePlayers中删除
                gamePlayers.splice(index, 1);
                console.log(`reducer:viewGame:SGAMEPLAYERS_DELETED:splice 2`);
            }
            //重新赋值 不然虽然gamePlayers数组虽然已经删除了一个元素 但引用地址没有变 不会触发componentWillReceiveProps
            return {
                ...state,
                gamePlayers: [...gamePlayers],
            }
        }
        
        case SET_GAME:
            return {
                ...state,
                game: action.game,
            }
        case FETCH_GAME_PLAYERS:
            return {
                ...state,
                fetching: true,
                error: null
            }
        case FETCH_GAME_PLAYERS_FAILED:
            return {
                ...state,
                fetching: false,
                gamePlayers: [],
                error: action.error
            };
        case FETCH_GAME_PLAYERS_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                gamePlayers: action.gamePlayers,
                error: null,
            };
        case CLEAR_STATE:
            return {
                ...initialState
            };
        case CLEAR:
            console.log('reducer:viewGame:CLEAR')
            return {
                ...initialState
            };
        default:
            return state;
    }
}