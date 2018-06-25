
import {
    CLEAR,
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
    FETCH_RAKEOFFS, FETCH_RAKEOFFS_FAILED, FETCH_RAKEOFFS_SUCCESSFUL
} from '../actions/addPlayer'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //保存 包括新增和更新
    saving: false,//正在保存
    saved: false,//保存是否成功
    player: null,

    fetching: false,//正在查询
    rakeoffs: [],
    error: null,
};

export function addPlayer(state = initialState, action) {
    switch (action.type) {
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

        case SAVE:
            return {
                ...state,
                saving: true,
                saved: false,
                player: action.player,
                error: null
            }
        case SAVE_FAILED:
            return {
                ...state,
                saving: false,
                saved: false,
                player: action.player,
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