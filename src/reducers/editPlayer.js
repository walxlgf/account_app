
import {

    SET,
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
    FETCH_RAKEOFFS, FETCH_RAKEOFFS_FAILED, FETCH_RAKEOFFS_SUCCESSFUL,
    GET, GET_FAILED, GET_SUCCESSFUL,
    CLEAR
} from '../actions/editPlayer'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    playerBySet: null,
    //保存 包括新增和更新
    saving: false,//正在保存
    saved: false,//保存是否成功
    player: null,

    fetching: false,//正在查询
    rakeoffs: [],

    getting: false,

    error: null,
};

export function editPlayer(state = initialState, action) {
    switch (action.type) {
        case SET:
            return {
                ...state,
                playerBySet: action.player,
            }
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

        case GET:
            return {
                ...state,
                getting: true,
                error: null
            }
        case GET_FAILED:
            return {
                ...state,
                getting: false,
                error: action.error
            };
        case GET_SUCCESSFUL:
            return {
                ...state,
                getting: false,
                player: action.player,
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
                player: action.player,
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