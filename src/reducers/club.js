
import {
    SET_CLUB,
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
    UPEATE_CLUB, UPEATE_CLUB_FAILED, UPEATE_CLUB_SUCCESSFUL,
    FETCH_CLUBS, FETCH_CLUBS_FAILED, FETCH_CLUBS_SUCCESSFUL,
    DELETE_CLUB, DELETE_CLUB_FAILED, DELETE_CLUB_SUCCESSFUL,
} from '../actions/club'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    opt: 'add', //什么状态
    //保存 包括新增和更新
    saving: false,//正在保存
    saved: false,//保存是否成功
    club: null,

    //查询
    fetching: false,//正在查询
    hasmore: true,//是否最后一页
    clubs: [],

    //删除
    deleting: false,
    deletedClub: null,//已经被删除的club

    error: null,
};

export function club(state = initialState, action) {
    switch (action.type) {
        case SET_CLUB:
            return {
                ...state,
                club: action.club,
                opt: action.opt,
            }

        //更新时保存
        case UPEATE_CLUB:
            return {
                ...state,
                saving: true,
                saved: false,
                club: action.club,
                clubs: [],//设置一下为空 防止冲突
                deletedClub: null,//设置一下为空 防止冲突
                error: null
            }
        case UPEATE_CLUB_FAILED:
            return {
                ...state,
                saving: false,
                saved: false,
                club: action.club,
                error: action.error,
            };
        case UPEATE_CLUB_SUCCESSFUL:
            return {
                ...state,
                saving: false,
                saved: true,
                club: action.club,
                error: null,
            };
        //新增时保存
        case SAVE:
            return {
                ...state,
                saving: true,
                saved: false,
                club: action.club,
                clubs: [],//设置一下为空 防止冲突
                deletedClub: null,//设置一下为空 防止冲突
                error: null
            }
        case SAVE_FAILED:
            return {
                ...state,
                saving: false,
                saved: false,
                club: action.club,
                error: action.error,
            };
        case SAVE_SUCCESSFUL:
            return {
                ...state,
                saving: false,
                saved: true,
                club: action.club,
                error: null,
            };
        //分页获取列表
        case FETCH_CLUBS:
            return {
                ...state,
                fetching: true,
                saved: false,
                club: null,//设置一下为空 防止冲突
                deletedClub: null,//设置一下为空 防止冲突
                clubs: [],
                hasmore: true,
                error: null
            }
        case FETCH_CLUBS_FAILED:
            return {
                ...state,
                fetching: false,
                clubs: [],
                hasmore: true,
                error: action.error
            };
        case FETCH_CLUBS_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                clubs: action.clubs,
                hasmore: action.hasmore,
                error: null,
            };
        //删除
        case DELETE_CLUB:
            return {
                ...state,
                deleting: true,
                saved: false,//设置一下为空 防止冲突
                clubs: [],//设置一下为空 防止冲突
                deletedClub: null,
                error: null
            }
        case DELETE_CLUB_FAILED:
            return {
                ...state,
                deleting: false,
                deletedClub: null,
                error: action.error
            };
        case DELETE_CLUB_SUCCESSFUL:
            return {
                ...state,
                deleting: false,
                deletedClub: action.club,
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