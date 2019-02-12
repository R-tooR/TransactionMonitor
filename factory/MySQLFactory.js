const mysql = require('./active-record-mysql');
const mysqlParser = require('./queryparser-mysql');

function MySQLFactory(){
    this.createActiveRecord = function(entity){
        return mysql(entity);
    };

    this.createQueryParser = function () {
        return mysqlParser;
    };
}

module.exports = new MySQLFactory();