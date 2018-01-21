'use strict';

const mysql = require('mysql');
const config = require('../../_config.json');

let pool = mysql.createPool(config.database);

exports.shutdown = function shutdown() {
    return new Promise(function (resolve, reject) {
        if (pool) {
            let tmp = pool;
            pool = undefined;
            tmp.end(resolve);
        } else {
            resolve();
        }
    });
};

exports.escape = mysql.escape;
exports.escapeId = mysql.escapeId;
exports.format = mysql.format;
exports.getConnection = function getConnection(cb) {
    return pool.getConnection(cb);
}

exports.myQuery = function (sql, data = []) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('--db.Login getConn error:', err);
                return reject({ error: 'system', http: 500, why: '数据库内部错误' });
            }
            connection.query(sql, data, function (err, result) {
                if (err) {
                    console.error('--mysqlint.connection.query getConn error:', err);
                    return reject({ error: 'system', http: 500, why: '数据库内部错误' });
                }
                connection.release();
                // console.log(result);
                resolve(result);
            });
        });
    });
};

exports.end = function () {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.end();
    });
}

// -----test mysql-----
// exports.myQuery('insert into user set ?', { name: '张三', password: 'pwdzhangsan', mail: 'zhansdasgsan@gmail.com' });// 插入
// exports.myQuery('insert into user (name, password, mail)values(?,?,?);', ['嘿嘿', 'pwdzhangsan', 'zhangsan@gmail.com']);// 插入
// exports.myQuery('update user set password=? where name="张三"', ["dadsadsad2"]);// 更新
// exports.myQuery('select * from user where name="张三"');// 查询一个
// exports.myQuery('select * from user');// 查询所有
// exports.myQuery('delete from user where name="张三"');// 删除


exports.Transaction = function Transaction(conn) {
    let self = this;
    self.isRollback = false;
    if (conn) {
        self._conn = conn;
    }/*else if(pool) {
		pool.getConnection(function(err, conn) {
			self._conn = conn;
			if(self.callback){
				self._doQuery('start transaction');
			}
		});
	}*/

    this._onQueryComplete = function (err, result) {
        let sql = self.callback(self.index, err, result);
        if (err) {
            self.rollback();
            return;
        }
        if (self.isRollback) {
            return;
        }
        self.index++;
        if (sql instanceof Object) {
            if (sql.sql && sql.sql.length > 0) {
                self._doQuery(sql.sql, sql.data, sql.debug);
            } else {	//	nil sql string, callback with null result and err.
                return self._onQueryComplete();
            }
        } else {
            self._doQuery('commit', [], false, function (err, result) {
                function onFinish() {
                    self._conn.release();
                    delete self._conn;
                    self.callback('commit', err, result);
                }
                if (err) {
                    self.rollback(onFinish);
                } else {
                    onFinish();
                }
            });
        }
    };

    this._doQuery = function (sql, data, debug, cb) {
        let rr = self._conn.query(sql, data, cb ? cb : self._onQueryComplete);
        if (debug) {
            console.log(rr.sql);
        }
    };

    this.start = function (cb) {
        self.callback = cb;
        self.index = 0;
        if (self._conn) {
            self._doQuery('start transaction');
        } // else wait getConnection callback
    };

    this.rollback = function (next) {
        if (self.isRollback) {
            console.error('Re-rollback.');
            if ('function' == typeof next) {
                next();
            }
            return;
        }
        self.isRollback = true;
        self._doQuery('rollback', [], false, function () {
            //console.log('--rollbacked--');
            self._conn.release();
            delete self._conn;
            if ('function' == typeof next) {
                next();
            }
        });
    };
}
