import Parse from 'parse';
import { STATUS_GAMING, STATUS_FINISHED } from '../parse/game'

export const SAVE = "SAVE_GAME"
export const SAVE_FAILED = "SAVE_GAME_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_GAME_SUCCESSFUL"

/**
 * 新建时保存
 * @param {object} data 
 */
export const save = (data) => {
    return dispatch => {
        let Game = Parse.Object.extend("Game");
        let game = new Game();
        game.set('name', data.name);
        game.set('status', STATUS_GAMING);
        game.set('startTime', data.startTime);
        game.set('duration', data.duration);
        game.set('user', Parse.User.current());
        dispatch({ type: SAVE, game });
        game.save()
            .then(function (game) {
                dispatch({ type: SAVE_SUCCESSFUL, game });
            }, function (error) {
                console.log(`action:game:save:error:${JSON.stringify(error)}`)
                dispatch({ type: SAVE_FAILED, game, error });
            });
    }
}

