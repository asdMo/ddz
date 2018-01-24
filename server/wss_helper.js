'use strict';

// const mysqlint = require('./lib/db/mysqlint');
// const mysql_helper = require('./mysql_helper.js');
const _TAG = 'WebSocket server helper ';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function getRandomList(n) {
    //参数校验
    if (n === undefined) return [];
    if (typeof (n) !== 'number' && typeof (n) !== 'string') return [];
    n = Math.floor(n);
    //将整数取值范围作为变量提取出来
    let min = 0, max = 99;
    //准备一个容器保存结果
    let list = [];
    for (let i = 0; i < n; i++) {
        //创建一个随机数
        let rand = Math.floor(Math.random() * (max - min + 1) + min);
        //检查是否重复
        if (list.indexOf(rand) >= 0) {
            i--;
        } else {
            list.push(rand);
        }
    }
    return list;
};

// 广播消息（测试广播时间）
exports.broadcastMessage = function (msg) {
    setInterval(function () {
        server.clients.forEach(element => {
            let msg = {
                time: new Date().Format("YYYYMMddhhmmssS")
            };
            element.send(JSON.stringify(msg));
        });
    }, 1000);
}

// 客户端操作数据库示例;
// useMysql(sql, data = []) {
//     this.send({ f: 'useMysql', sql, data });
// }
// useMysql(`insert into user (uid)values(?);`, [10010]);//插入
// useMysql(`update user set score=? where uid=10010;`, [10]);//更新
// useMysql(`select * from user where uid=10010;`);//查询单个
// useMysql(`select * from user;`);//查询所有
// useMysql(`delete from user where uid='10010';`);//删除
exports.useMysql = function (msg) {
    console.log(_TAG + 'useMysql ==>sql: ' + msg.sql + ' data: ' + msg.data);
    let self = this;
    mysqlint.myQuery(msg.sql, msg.data).then(function (obj) {
        self.send(JSON.stringify(obj));
    });
};
