
import {
    CLEAR,
    FETCH, FETCH_FAILED, FETCH_SUCCESSFUL,
} from '../actions/rakeoffs'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //查询
    fetching: false,//正在查询
    rakeoffs: [],
    error: null,
};

export function rakeoffs(state = initialState, action) {
    switch (action.type) {
        case FETCH:
            return {
                ...state,
                fetching: true,
                rakeoffs: [],
                error: null
            }
        case FETCH_FAILED:
            return {
                ...state,
                fetching: false,
                rakeoffs: [],
                error: action.error
            };
        case FETCH_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                rakeoffs: action.rakeoffs,
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