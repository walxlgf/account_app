
import {
    CLEAR,
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
} from '../actions/addRakeoff'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //保存 包括新增和更新
    saving: false,//正在保存
    saved: false,//保存是否成功
    rakeoff: null,
    error: null,
};

export function addRakeoff(state = initialState, action) {
    switch (action.type) {
        case SAVE:
            return {
                ...state,
                saving: true,
                saved: false,
                rakeoff: action.rakeoff,
                rakeoffs: [],//设置一下为空 防止冲突
                deletedClub: null,//设置一下为空 防止冲突
                error: null
            }
        case SAVE_FAILED:
            return {
                ...state,
                saving: false,
                saved: false,
                rakeoff: action.rakeoff,
                error: action.error,
            };
        case SAVE_SUCCESSFUL:
            return {
                ...state,
                saving: false,
                saved: true,
                rakeoff: action.rakeoff,
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