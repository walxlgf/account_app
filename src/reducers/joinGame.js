
import {
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
    FETCH_PLAYERS, FETCH_PLAYERS_FAILED, FETCH_PLAYERS_SUCCESSFUL,
    FETCH_GAMES, FETCH_GAMES_FAILED, FETCH_GAMES_SUCCESSFUL,
    CLEAR,
} from '../actions/joinGame'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //保存 包括新增和更新
    games:[],
    players:[],
    saving: false,//正在保存
    saved: false,//保存是否成功
    gamePlayer: null,
    error: null,
};

export function joinGame(state = initialState, action) {
    switch (action.type) {
        case FETCH_GAMES:
            return {
                ...state,
                fetching: true,
                games: [],
                error: null
            }
        case FETCH_GAMES_FAILED:
            return {
                ...state,
                fetching: false,
                games: [],
                error: action.error
            };
        case FETCH_GAMES_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                games: action.games,
                error: null,
            };
        case FETCH_PLAYERS:
            return {
                ...state,
                fetching: true,
                players: [],
                error: null
            }
        case FETCH_PLAYERS_FAILED:
            return {
                ...state,
                fetching: false,
                players: [],
                error: action.error
            };
        case FETCH_PLAYERS_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                players: action.players,
                error: null,
            };
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
        case CLEAR_STATE:
        case CLEAR:
            return {
                ...initialState
            };
        default:
            return state;
    }
}