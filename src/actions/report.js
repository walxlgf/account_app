import Parse from 'parse';
import { TYPE_DEPOSIT, TYPE_WITHDRAW, TYPE_UP, TYPE_DOWN, fetchLogsByDate, TYPE_SHUI } from '../parse/log';
import { getLastReport } from '../parse/report';

export const FETCH = "FETCHS_REPORTS"
export const FETCH_FAILED = "FETCHS_REPORTS_FAILED"
export const FETCH_SUCCESSFUL = "FETCHS_REPORTS_SUCCESSFUL"


export const SAVE = "SAVE"
export const SAVE_FAILED = "SAVE_FAILED"
export const SAVE_SUCCESSFUL = "SAVE_SUCCESSFUL"

export const CLEAR = "CLEAR_REPORTS"

export const SREPORTS_CREATED = "SREPORTS_CREATED"


//监听reports列表
let sreports;
export const subscribeReports = () => {
    return dispatch => {
        let Report = Parse.Object.extend("Report");
        let query = new Parse.Query(Report);
        sreports = query.subscribe();
        sreports.on('open', () => {
            console.log(`action:report:sreports:opened:`);
        });
        sreports.on('create', (report) => {
            console.log(`action:report:sreports created:${JSON.stringify(report)}`);
            dispatch({ type: SREPORTS_CREATED, report: report });
        });

        sreports.on('close', () => {
            console.log('action:report:sreports:closed');
        });
    }
}


export const unsubscribeReports = () => {
    return dispatch => {
        if (sreports) {
            sreports.unsubscribe();
        }
    }
}

/**
 * 
 */
export const clear = () => {
    return dispatch => {
        dispatch({ type: CLEAR });
    }
}

/**
 * 
 * @param {Parse.Object.extend("Player")} player 
 */
export const save = (date) => {
    return dispatch => {
        //获取最近时间
        //获取这个时间段的所有充值 提现 上分下分 水钱 都提取出来 存入report
        //获取这个时间段的所有比赛 
        //获取这个时间段的所有玩家数据
        let lastReport;
        let lastEnd;
        getLastReport().then(function (report) {
            console.log(`action:report:save:getLastReport:`);
            lastReport = report;
            if (lastReport)
                lastEnd = lastReport.get('end');
            return fetchLogsByDate(lastEnd, date);
        }).then(function (logs) {
            console.log(`action:report:save:getLastReport:${logs && logs.length}`);
            let up = 0;
            let down = 0;
            let deposit = 0;
            let withdraw = 0;
            let shui = 0;
            let games = [];
            let players = [];

            logs.map((log, index) => {
                let amount = log.get('amount');
                switch (log.get('type')) {
                    case TYPE_UP:
                        up += amount;
                        break;
                    case TYPE_DOWN:
                        down += amount;
                        break;
                    case TYPE_DEPOSIT:
                        deposit += amount;
                        break;
                    case TYPE_WITHDRAW:
                        withdraw += amount;
                        break;
                    case TYPE_SHUI:
                        shui += amount;
                        break;
                }
            });

            logs.map((log, index) => {
                switch (log.get('type')) {
                    case TYPE_UP:
                    case TYPE_DOWN:
                    case TYPE_DEPOSIT:
                    case TYPE_WITHDRAW:
                        let player = log.get('player');
                        let player1 = players.find(function (value, index, arr) {
                            return value.id === player.id;
                        });
                        if (!player1)
                            players.push(player);
                        break;
                }
            });

            logs.map((log, index) => {
                switch (log.get('type')) {
                    case TYPE_UP:
                    case TYPE_DOWN:
                    case TYPE_SHUI:
                        let game = log.get('game');
                        let game1 = games.find(function (value, index, arr) {
                            return value.id === game.id;
                        });
                        if (!game1)
                            games.push(game);
                        break;
                }
            });


            let Report = Parse.Object.extend("Report");
            let report = new Report();
            report.set('up', up);
            report.set('down', down);
            report.set('deposit', deposit);
            report.set('withdraw', withdraw);
            report.set('shui', shui);
            report.set('games', games);
            report.set('players', players);
            report.set('start', lastEnd);
            report.set('end', date);
            return report.save();
        }).then(function (report) {
            console.log(`action:report:save:save:${JSON.stringify(report)}`);
        }, function (error) {

        })



    }
}

/**
 */
export const fetchReports = () => {
    return dispatch => {
        dispatch({ type: FETCH });
        let Report = Parse.Object.extend("Report");
        let query = new Parse.Query(Report);
        query.descending('createdAt');
        query.find()
            .then(function (results) {
                dispatch({ type: FETCH_SUCCESSFUL, reports: results });
            }, function (error) {
                dispatch({ type: FETCH_FAILED, error });
            });

    }
}






