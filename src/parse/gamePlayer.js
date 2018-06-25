import Parse from 'parse';


import { TYPE_UP, TYPE_DOWN } from '../parse/log'

/**
 * 设置GamePlayer的Chips
 * @param {*} gp GamePlayer对象 
 * @param {*} amount 数额
 * @param {*} type pay 或 repay  pay 加  repay减
 */
export function setGPChips(gp, amount, type) {
    let chips = gp.get('chips');
    if (!chips)
        chips = 0;
    if (type === TYPE_UP)
        chips += amount;
    else if (type === TYPE_DOWN)
        chips -= amount;
    gp.set('chips', chips);
    return gp.save();
}

/**
 * 根据game和player获取相应的GamePlayer
 * @param {*} game 
 * @param {*} player 
 */
export function getGP(game, player) {
    let GamePlayer = Parse.Object.extend("GamePlayer");
    let query = new Parse.Query(GamePlayer);
    query.descending('_created_at');
    query.equalTo('game', game);
    query.equalTo('player', player);
    return query.first()
}


/**
 * 新建gamePlayer
 * @param {*} game 
 * @param {*} player 
 */
export function insertGPs(game, players) {
    let GamePlayer = Parse.Object.extend("GamePlayer");
    let gps = [];
    for (let player of players) {
        let gp = new GamePlayer();
        gp.set('game', game);
        gp.set('player', player);
        gp.set('chips', 0);
        gps.push(gp)
    }
    return Parse.Object.saveAll(gps);

}

/**
 * 更新gameplayer数组
 * @param {*} gamePlayers 
 */
export function updateGPs(gamePlayers) {
    return Parse.Object.saveAll(gamePlayers);

}

