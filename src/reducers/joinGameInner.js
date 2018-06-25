
import {
    SET_GAME,
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
    FETCH_PLAYERS, FETCH_PLAYERS_FAILED, FETCH_PLAYERS_SUCCESSFUL,
    CLEAR,
} from '../actions/joinGameInner'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //保存 包括新增和更新
    game: null,
    saving: false,//正在保存
    saved: false,//保存是否成功
    gamePlayers: [],
    error: null,
};

export function joinGameInner(state = initialState, action) {
    switch (action.type) {
        case SET_GAME:
            return {
                ...state,
                game: action.game,
            }

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
        case CLEAR_STATE:
        case CLEAR:
            return {
                ...initialState
            };
        default:
            return state;
    }
}