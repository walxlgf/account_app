
import {
    SET_REQ,
    SAVE, SAVE_FAILED, SAVE_SUCCESSFUL,
    FETCH_REQS, FETCH_REQS_FAILED, FETCH_REQS_SUCCESSFUL,
    FETCH_GAMES, FETCH_GAMES_FAILED, FETCH_GAMES_SUCCESSFUL,
    FETCH_PLAYERS, FETCH_PLAYERS_FAILED, FETCH_PLAYERS_SUCCESSFUL,
    DELETE_REQ, DELETE_REQ_FAILED, DELETE_REQ_SUCCESSFUL,
    SREQS_CREATED, SREQS_DELETED, FETCHS_PLAYERS,
} from '../actions/req'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    opt: 'add', //是否只读 在编辑页可用
    //保存 包括新增和更新
    saving: false,//正在保存
    saved: false,//保存是否成功
    req: null,

    //查询
    fetching: false,//正在查询
    reqs: [],

    //删除
    deleting: false,
    deletedReq: null,//已经被删除的req

    error: null,
};

export function req(state = initialState, action) {
    switch (action.type) {
        case SREQS_CREATED: {
            let index = state.reqs.findIndex(function (value, index, arr) {
                return value.id === action.req.id;
            });
            //如果没有 说明还没有添加 添加进来
            if (index == -1) {
                state.reqs = [action.req, ...state.reqs];
            }
            return {
                ...state,
            };
        }
        case SREQS_DELETED: {

            let reqs = [...state.reqs];
            //获取被删除req的索引
            let index = reqs.findIndex(function (value, index, arr) {
                return value.id === action.req.id;
            });
            console.log(`reducer:req:SREQS_DELETED:index:${index} 1`);
            if (index != -1) {
                //从state.reqs中删除
                reqs.splice(index, 1);
                console.log(`reducer:req:SREQS_DELETED:splice 2`);
            }
            //重新赋值 不然虽然reqs数组虽然已经删除了一个元素 但引用地址没有变 不会触发componentWillReceiveProps
            return {
                reqs: [...reqs],
            }
        }
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
        case SET_REQ:
            return {
                ...state,
                req: action.req,
                opt: action.opt,
            }
        //新增时保存
        case SAVE:
            return {
                ...state,
                saving: true,
                saved: false,
                req: action.req,
                reqs: [],//设置一下为空 防止冲突
                deletedReq: null,//设置一下为空 防止冲突
                error: null
            }
        case SAVE_FAILED:
            return {
                ...state,
                saving: false,
                saved: false,
                req: action.req,
                error: action.error,
            };
        case SAVE_SUCCESSFUL:
            return {
                ...state,
                saving: false,
                saved: true,
                req: action.req,
                error: null,
            };
        //分页获取列表
        case FETCH_REQS:
            return {
                ...state,
                fetching: true,
                saved: false,
                req: null,//设置一下为空 防止冲突
                deletedReq: null,//设置一下为空 防止冲突
                reqs: [],
                error: null
            }
        case FETCH_REQS_FAILED:
            return {
                ...state,
                fetching: false,
                reqs: [],
                error: action.error
            };
        case FETCH_REQS_SUCCESSFUL:
            return {
                ...state,
                fetching: false,
                reqs: [...action.reqs],
                error: null,
            };
        //删除
        case DELETE_REQ:
            return {
                ...state,
                deleting: true,
                saved: false,//设置一下为空 防止冲突
                reqs: [],//设置一下为空 防止冲突
                deletedReq: null,
                error: null
            }
        case DELETE_REQ_FAILED:
            return {
                ...state,
                deleting: false,
                deletedReq: null,
                error: action.error
            };
        case DELETE_REQ_SUCCESSFUL:
            return {
                ...state,
                deleting: false,
                deletedReq: action.req,
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