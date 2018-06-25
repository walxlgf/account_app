import Parse from 'parse';

export const STATUS_GAMING = "GAMING"
export const STATUS_FINISHED = "FINISHED"
/**
 * 设置比赛状态
 * @param {*} game 
 * @param {*} status 
 */
export function setGameStatus(game, status) {
    game.set('status', status)
    return game.save();
}


