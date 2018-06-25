
import {
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
} from '../actions/addGame'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //保存 包括新增和更新
    saving: false,//正在保存
    saved: false,//保存是否成功
    game: null,
    error:null,
};

export function addGame(state = initialState, action) {
    switch (action.type) {
        //新增时保存
        case SAVE:
            return {
                ...state,
                saving: true,
                saved: false,
                game: action.game,
                error: null
            }
        case SAVE_FAILED:
            return {
                ...state,
                saving: false,
                saved: false,
                game: action.game,
                error: action.error,
            };
        case SAVE_SUCCESSFUL:
            return {
                ...state,
                saving: false,
                saved: true,
                game: action.game,
                error: null,
            };
        case CLEAR_STATE:
            return {
                ...initialState
            };
        default:
            return state;
    }
}