'use strict';

const mysqlint = require('./mysqlint.js');
const table = require('./table.js');

const kCreateUser = `create table if not exists ${table.user}(
    id bigint not null primary key auto_increment,
    uid VARCHAR(50) default null,
    score BIGINT not null default 0 comment "分数",
    creation datetime default CURRENT_TIMESTAMP,
    lastActive TIMESTAMP default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    index(uid)
)COLLATE='utf8_general_ci';`;
mysqlint.myQuery(kCreateUser);

// const kCreateUser = `create table if not exists ${table.user}(
//     id BIGINT not null primary key auto_increment,
//     uid VARCHAR not null comment "学号",
//     classno VARCHAR(16) default null comment "班级号",
//     stage INT(11) not null default 1 comment "关卡",
//     score BIGINT not null default 0 comment "分数",
//     sex BIGINT not null default -1 comment "性别",
//     rank BIGINT not null default 0 comment "关卡排名",
//     creation datetime default CURRENT_TIMESTAMP,
//     lastActive TIMESTAMP default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     index(uid),
//     index(stage)
// )COLLATE='utf8_general_ci';`;


