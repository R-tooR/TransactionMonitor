const mysql = require('./active-record-mysql');
const mysqlParser = require('../queryparsers/queryparser-mysql');

function MysqlFactory(){
    this.createActiveRecord = function(entity){
        return mysql(entity);
    };

    this.createQueryParser = function () {
        return mysqlParser;
    };
}

module.exports = new MysqlFactory();