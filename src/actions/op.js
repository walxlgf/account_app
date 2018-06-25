import Parse from 'parse';

import { TYPE_UP, TYPE_DOWN, TYPE_DEPOSIT, TYPE_WITHDRAW } from '../parse/log'
import { insertLog } from '../parse/log'
import { setPlayerBalance } from '../parse/player'
import { setGPChips, getGP } from '../parse/gamePlayer'
import { delReq } from '../parse/req'

export const UP = "UP"
export const UP_FAILED = "UP_FAILED"
export const UP_SUCCESSFUL = "UP_SUCCESSFUL"

/**
 * 根据上分请求上分
 * @param {*} req 请求上分记录
 */
export const upReq = (req) => {
    return dispatch => {
        let game = req.get('game');
        let player = req.get('player');
        let amount = req.get('amount');
        // 1 检查余额 先省略
        // 2 player balance 增加
        // 3 Log添加一条up记录
        // 4 gameplayer 对象的chips增加 
        // 5 player balance 减少 
        // 6 Log添加一条pay记录
        // 7 删除请求上分记录
        console.log(`action:op:up:0`)
        let gp;
        getGP(game, player).then(function (gamep) {
            console.log(`action:op:up:getGP:1`);
            gp = gamep;
            // 2 player balance 增加
            return setPlayerBalance(player, amount, TYPE_DEPOSIT)
        }).then(function (player) {
            console.log(`action:op:up:setPlayerBalance:2`);
            //3 Log添加一条up记录
            return insertLog(game, player, TYPE_DEPOSIT, amount);
        }).then(function (log) {
            console.log(`action:op:up:insertLog:3`);
            //4 gameplayer 对象的chips增加 
            return setGPChips(gp, amount, TYPE_UP);
        }).then(function (gp) {
            console.log(`action:op:up:setGPChips:4`);
            // 5 player balance 减少 
            return setPlayerBalance(player, TYPE_UP, amount);
        }).then(function (gp) {
            console.log(`action:op:up:insertLog:5`);
            // 6 Log添加一条pay记录
            return insertLog(game, player, TYPE_UP, amount);
        }).then(function (log) {
            console.log(`action:op:up:insertLog:6`);
            // 6 Log添加一条pay记录
            return delReq(req);
        }).then(function (req) {
            console.log(`action:op:up:delReq:7`);
        }, function (error) {
            console.log(`action:op:up:error:${error}`);
        })
    }
}

/**
 * 上分
 * @param {} gp  gamePlayer
 * @param {} player 玩家
 * @param {} amount 金额 
 * @param {} game 
 */
export const up = (player, amount, game) => {
    return dispatch => {
        // 1 检查余额 先省略
        // 2 player balance 增加
        // 3 Log添加一条up记录
        // 4 gameplayer 对象的chips增加 
        // 5 player balance 减少 
        // 6 Log添加一条pay记录
        // 7 删除
        console.log(`action:op:up:0`)
        let gp;
        getGP(game, player).then(function (gamep) {
            console.log(`action:op:up:getGP:1`)
            gp = gamep;
            // 2 player balance 增加
            return setPlayerBalance(player, amount, TYPE_DEPOSIT)
        }).then(function (player) {
            console.log(`action:op:up:setPlayerBalance:2`)
            //3 Log添加一条up记录
            return insertLog(game, player, TYPE_DEPOSIT, amount);
        }).then(function (log) {
            console.log(`action:op:up:insertLog:3`)
            //4 gameplayer 对象的chips增加 
            return setGPChips(gp, amount, TYPE_UP);
        }).then(function (gp) {
            console.log(`action:op:up:setGPChips:4`)
            // 5 player balance 减少 
            return setPlayerBalance(player, amount, TYPE_UP);
        }).then(function (gp) {
            console.log(`action:op:up:insertLog:5`)
            // 6 Log添加一条pay记录
            return insertLog(game, player, TYPE_UP, amount);
        }, function (error) {
            console.log(`action:op:up:error:${error}`);
        })
        console.log(`action:op:up:insertLog:6`)
    }
}




