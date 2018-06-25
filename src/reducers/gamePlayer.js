
import {
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
    FETCH_GAME_PLAYERS, FETCH_GAME_PLAYERS_FAILED, FETCH_GAME_PLAYERS_SUCCESSFUL,
    CLEAR,
} from '../actions/gamePlayer'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //保存 包括新增和更新
    saving: false,//正在保存
    saved: false,//保存是否成功
    gamePlayer: null,

    //查询
    fetching: false,//正在查询
    hasmore: true,//是否最后一页
    gamePlayers: [],

    error: null,
};

export function gamePlayer(state = initialState, action) {
    switch (action.type) {
        //新增时保存
        case SAVE:
            return {
                ...state,
                saving: true,
                saved: false,
                gamePlayer: action.gamePlayer,
                gamePlayers: [],//设置一下为空 防止冲突
                deletedGamePlayer: null,//设置一下为空 防止冲突
                error: null
            }
        case SAVE_FAILED:
            return {
                ...state,
                saving: false,
                saved: false,
                gamePlayer: action.gamePlayer,
                error: action.error,
            };
        case SAVE_SUCCESSFUL:
            return {
                ...state,
                saving: false,
                saved: true,
                gamePlayer: action.gamePlayer,
                error: null,
            };
        //分页获取列表
        case FETCH_GAME_PLAYERS:
            return {
                ...state,
                fetching: true,
                saved: false,
                gamePlayer: null,//设置一下为空 防止冲突
                deletedGamePlayer: null,//设置一下为空 防止冲突
                gamePlayers: [],
                hasmore: true,
                error: null
            }
        case FETCH_GAME_PLAYERS_FAILED:
            return {
                ...state,
                fetching: false,
                gamePlayers: [],
                hasmore: true,
                error: action.error
            };
        case FETCH_GAME_PLAYERS_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                gamePlayers: action.gamePlayers,
                hasmore: action.hasmore,
                error: null,
            };
        case CLEAR_STATE:
        case CLEAR:
            return {
                ...initialState
            };
        default:
            return state;
    }
}