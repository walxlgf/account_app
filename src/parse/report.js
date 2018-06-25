import Parse from 'parse';
/**
 * 获取最后一次结算
 */
export function getLastReport() {
    let Report = Parse.Object.extend("Report");
    let query = new Parse.Query(Report);
    query.descending('_created_at');
    return query.first()
}
