
import {
    CLEAR,
    FETCH, FETCH_FAILED, FETCH_SUCCESSFUL,
    SREPORTS_CREATED,
} from '../actions/report'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //查询
    fetching: false,//正在查询
    reports: [],
    error: null,
};

export function report(state = initialState, action) {
    switch (action.type) {
        case SREPORTS_CREATED: {
            let index = state.reports.findIndex(function (value, index, arr) {
                return value.id === action.report.id;
            });
            //如果没有 说明还没有添加 添加进来
            if (index == -1) {
                state.reports = [action.report, ...state.reports];
            }
            return {
                ...state,
            };
        }
        case FETCH:
            return {
                ...state,
                fetching: true,
                reports: [],
                error: null
            }
        case FETCH_FAILED:
            return {
                ...state,
                fetching: false,
                reports: [],
                error: action.error
            };
        case FETCH_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                reports: action.reports,
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