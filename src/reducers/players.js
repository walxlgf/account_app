
import {
    CLEAR,
    FETCH, FETCH_FAILED, FETCH_SUCCESSFUL,
    DELETE, DELETE_FAILED, DELETE_SUCCESSFUL,
    SPLAYERS_CREATED, SPLAYERS_UPDATED, SPLAYERS_DELETED,
} from '../actions/players'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {

    //查询
    fetching: false,//正在查询
    players: [],

    //删除
    deleting: false,
    deletedPlayer: null,//已经被删除的player

    error: null,
};

export function players(state = initialState, action) {
    switch (action.type) {
        case SPLAYERS_CREATED: {
            let index = state.players.findIndex(function (value, index, arr) {
                return value.id === action.player.id;
            });
            //如果没有 说明还没有添加 添加进来
            if (index == -1) {
                state.players = [action.player, ...state.players];
            }
            return {
                ...state,
            };
        }
        
        case SPLAYERS_UPDATED: { 
            console.log(`reducer:viewGame:SPLAYERS_UPDATED:1:player:${action.player}`);
            let players = [...state.players];
            let index = players.findIndex(function (value, index, arr) {
                return value.id === action.player.id;
            });
            if (index != -1) {
                players.splice(index, 1, action.player);
            }
            return {
                ...state,
                //复制一份games 不然Listview.Datasource 不会触发更新 
                players: [...players],
            }
        }
        case SPLAYERS_DELETED: {
            let players = [...state.players];
            //获取被删除player的索引
            let index = players.findIndex(function (value, index, arr) {
                return value.id === action.player.id;
            });
            console.log(`reducer:viewGame:SPLAYERS_DELETED:index:${index} 1`);
            if (index != -1) {
                //从state.players中删除
                players.splice(index, 1);
                console.log(`reducer:viewGame:SPLAYERS_DELETED:splice 2`);
            }
            //重新赋值 不然虽然players数组虽然已经删除了一个元素 但引用地址没有变 不会触发componentWillReceiveProps
            return {
                ...state,
                players: [...players],
            }
        }
        case FETCH:
            return {
                ...state,
                fetching: true,
                players: [],
                error: null
            }
        case FETCH_FAILED:
            return {
                ...state,
                fetching: false,
                players: [],
                error: action.error
            };
        case FETCH_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                players: action.players,
                error: null,
            };
        case CLEAR:
        case CLEAR_STATE:
            return {
                ...initialState
            };
        default:
            return state;
    }
}