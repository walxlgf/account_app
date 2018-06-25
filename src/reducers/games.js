
import {
    FETCH_GAMES, FETCH_GAMES_FAILED, FETCH_GAMES_SUCCESSFUL,
} from '../actions/games'


import {
    CLEAR_STATE,
} from '../actions/auth'


const initialState = {
    //查询
    fetching: false,//正在查询
    games: [],

    error: null,
};

export function games(state = initialState, action) {
    switch (action.type) {
        //分页获取列表
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
        case CLEAR_STATE:
            return {
                ...initialState
            };
        default:
            return state;
    }
}