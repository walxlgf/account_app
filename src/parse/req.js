import Parse from 'parse';

/**
 * 删除指定的req
 * @param {*} req 
 */
export function delReq(req) {
    return req.destroy();
}

