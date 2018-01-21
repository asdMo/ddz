'use strict';

const mysqlint = require('./mysqlint.js');
const dbname = require('../../_config.json').dbname;

exports.user = mysqlint.escapeId(dbname.share + '.user');


Object.freeze(exports);
