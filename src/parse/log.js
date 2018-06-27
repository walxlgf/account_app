import Parse from 'parse';


export const TYPE_DEPOSIT = "DEPOSIT";
export const TYPE_WITHDRAW = "WITHDRAW";
export const TYPE_UP = "UP";
export const TYPE_DOWN = "DOWN";
export const TYPE_SHUI = "SHUI";//水钱


/**
 * 
 * @param {*} game parse对象
 * @param {*} player 
 * @param {*} type 四种 up down pay repay 
 * @param {*} amount 金额 只能大于0
 */
export function insertLog(game, player, son, type, amount) {
    let Log = Parse.Object.extend("Log");
    let log = new Log();
    log.set('user', Parse.User.current());
    log.set('game', game);
    log.set('player', player);
    log.set('son', son);
    log.set('type', type);
    log.set('amount', amount);
    //日志一般都在操作之后插入 所以余额直接插入player的余额
    log.set('balance', player.get('balance'));
    return log.save();
}


/**
 * 比赛结算时 根据gameplayers生成log
 */
export function insertGameDownsLog(gamePlayers) {
    let Log = Parse.Object.extend("Log");
    let logs = [];
    let totalShuiChips = 0;
    let game;
    gamePlayers.map((gp) => {
        if (!game)
            game = gp.get('game');
        let player = gp.get('player');
        let son = gp.get('son');
        let finalChips = gp.get('finalChips');
        let shuiChips = gp.get('shuiChips');

        totalShuiChips += shuiChips;

        let log = new Log();
        log.set('user', Parse.User.current());
        log.set('game', game);
        log.set('player', player);
        log.set('son', son);
        log.set('type', TYPE_DOWN);
        log.set('amount', finalChips - shuiChips);
        //日志一般都在操作之后插入 所以余额直接插入player的余额
        log.set('balance', player.get('balance'));
        logs.push(log);
    })

    //水钱
    let log = new Log();
    log.set('user', Parse.User.current());
    log.set('game', game);
    log.set('type', TYPE_SHUI);
    log.set('amount', totalShuiChips);

    logs.push(log);
    return Parse.Object.saveAll(logs);
}



/**
 * 
 * @param {*} start 开始时间
 * @param {*} end 结束时间
 */
export function fetchLogsByDate(start, end) {
    let Log = Parse.Object.extend("Log");
    let query = new Parse.Query(Log);
    query.descending('createdAt');
    if (start)
        query.greaterThanOrEqualTo('createdAt', start);
    query.lessThan('createdAt', end)
    return query.find()
}


