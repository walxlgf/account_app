import Parse from 'parse';

import { TYPE_DEPOSIT, TYPE_WITHDRAW, TYPE_UP, TYPE_DOWN } from '../parse/log'

/**
 * 设置player的余额
 * @param {*} player 
 * @param {*} amount 数额
 * @param {*} type up 或 down  up 加  down
 */
export function setPlayerBalance(player, amount, type) {
    let balance = player.get('balance');
    if (!balance)
        balance = 0;
    if (type === TYPE_DEPOSIT || type === TYPE_DOWN)
        balance += amount;
    else if (type === TYPE_WITHDRAW || type === TYPE_UP)
        balance -= amount;
    player.set('balance', balance);
    return player.save();
}


/**
 * 比赛结算时设置此比赛所有玩家的余额
 */
export function setPlayersBalance(gamePlayers) {
    let players = [];
    gamePlayers.map((gp) => {
        let player = gp.get('player');
        let balance = player.get('balance');
        let finalChips = gp.get('finalChips');
        let shuiChips = gp.get('shuiChips');
        balance = balance + finalChips - shuiChips;
        player.set('balance', balance)
        players.push(player);
    })
    return Parse.Object.saveAll(players);
}

