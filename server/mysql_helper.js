'use strict';
const init_db = require('./lib/db/init_db.js');
const mysqlint = require('./lib/db/mysqlint.js');
const table = require('./lib/db/table.js');
const kInternelError = '数据库内部错误';

exports.defaultLogin = function (uid) {
    return new Promise(function (resolve, reject) {
        mysqlint.getConnection(function (e, conn) {
            if (e) {
                console.error('--db.Login getConn error:', e);
                return reject({ error: 'system', http: 500, why: kInternelError });
            }
            let retVal;
            let trans = new mysqlint.Transaction(conn);
            trans.start(function (idx, err, result) {
                if (err) {
                    console.error('--db.Login trans.start err:', err);
                    return reject({ error: 'system', http: 500, why: kInternelError });
                }
                let obj = {};
                const insert = `insert into ${table.user} (uid)values(?);`;
                const select = `select * from ${table.user} where uid=?;`;
                // console.log(idx, result);
                switch (idx) {
                    case 0:
                        obj.sql = select;
                        obj.data = [uid];
                        break;
                    case 1://检测是刷新还是插入
                        if (Array.isArray(result)) {
                            result = (result.length == 1) ? result[0] : null;
                        }
                        if (result) {//账户已经存在
                            obj.sql = select;
                            obj.data = [uid];
                        } else {//插入新数据
                            obj.sql = insert;
                            obj.data = [uid];
                        }
                        break;
                    case 2:
                        if (Array.isArray(result)) {
                            result = (result.length == 1) ? result[0] : null;
                        }
                        if (!result) {
                            return trans.rollback(function () {
                                console.error('--db.Login replace userinfo err:', err);
                                reject({ error: 'system', http: 500, why: 'Refresh user info error.' });
                            });
                        }

                        //刷新/插入 用户信息缓存成功
                        if (result.affectedRows) {
                            retVal = { result: true };
                        } else {
                            retVal = { result: true, why: '数据无变化' };
                        }
                        //判断账号信息是否存在
                        obj.sql = select;
                        obj.data = [uid];
                        break;
                    case 3:
                        if (Array.isArray(result)) {
                            result = (result.length == 1) ? result[0] : null;
                        }
                        if (result) {
                            //返回数据
                            //console.log(result);
                            retVal.data = result;
                            return 0;
                        }
                        //	读取默认值
                        obj.sql = `select * from ${table.user};`;
                        obj.data = [];
                        break;
                    case 'commit':
                        resolve(retVal);
                    default:
                        return 0;
                }
                return obj;
            });
        });
    });
};